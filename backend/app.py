from crypt import methods
import json
from re import I
from typing import Union
import os
import shutil

# Mysql imports
from flaskext.mysql import MySQL
from sqlalchemy import true

# Flask imports
import flask, flask_login
from flask_cors import CORS
from flask import Flask, Response, request, redirect, jsonify, send_file

# ENVIRONMENT VARIABLES
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
mysql = MySQL()

# CORS SETTINGS
CORS(
    app,
    origins=["http://127.0.0.1:3000", "http://localhost:3000"],
    supports_credentials=True,
)

# MAIN SETTINGS
app.secret_key = "super secret string"
app.config["MYSQL_DATABASE_USER"] = "root"
app.config["MYSQL_DATABASE_PASSWORD"] = os.getenv("PASSWORD")
app.config["MYSQL_DATABASE_DB"] = "photoshare"
app.config["MYSQL_DATABASE_HOST"] = "localhost"
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif"}

# MYSQL SETTINGS
mysql.init_app(app)

# LOGIN SETTINGS
login_manager = flask_login.LoginManager()
login_manager.init_app(app)


def getUserList() -> set:
    conn = mysql.connect()
    cursor = conn.cursor()
    cursor.execute("SELECT user_id from Users")
    sqlres = cursor.fetchall()
    return set([int(s[0]) for s in sqlres])


class User(flask_login.UserMixin):
    is_authenticated: bool

    def __init__(self, id, email, first_name, last_name) -> None:
        super().__init__()
        self.id = int(id)
        self.email = email
        self.first_name = first_name
        self.last_name = last_name


@login_manager.user_loader
def user_loader(user_id: int) -> Union[User, None]:
    users = getUserList()
    user_id = int(user_id)

    if user_id and user_id in users:
        conn = mysql.connect()
        cursor = conn.cursor()
        cursor.execute(
            f"SELECT email, first_name, last_name from Users WHERE user_id='{user_id}'"
        )
        email, first_name, last_name = cursor.fetchone()
        return User(user_id, email, first_name, last_name)
    return


@login_manager.request_loader
def request_loader(request) -> Union[User, None]:
    users = getUserList()

    email = request.form.get("email")
    password = request.form.get("password")

    if email and email in users:
        conn = mysql.connect()
        cursor = conn.cursor()

        cursor.execute(
            f"SELECT user_id, first_name, last_name, password FROM Users WHERE email = '{email}'"
        )
        user_id, first_name, last_name, sql_password = cursor.fetchone()

        user = User(user_id, email, first_name, last_name)
        user.is_authenticated = password == sql_password

        return user
    return


# ----------------------------------
# --------- LOGIN ROUTER -----------
# ----------------------------------


def isEmailUnique(email: str) -> bool:
    return (
        not mysql.connect()
        .cursor()
        .execute(f"SELECT email    FROM Users WHERE email = '{email}'")
    )


# LOG IN ROUTE
@app.route("/auth/login", methods=["POST"])
def login():
    # The request method is POST (page is recieving data)
    email = request.form["email"]
    password = request.form["password"]

    conn = mysql.connect()
    cursor = conn.cursor()

    # check if email is registered
    email_exists = cursor.execute(
        f"SELECT user_id, first_name, last_name, password FROM Users WHERE email = '{email}'"
    )
    if email_exists:
        user_id, first_name, last_name, sql_password = cursor.fetchone()

        if password == sql_password:
            user = User(user_id, email, first_name, last_name)
            flask_login.login_user(user)
            return redirect("http://127.0.0.1:3000/profile")

    # information did not match
    return "Try again or make an account"


# TO LOG OUT
@app.route("/auth/logout", methods=["GET"])
def logout():
    flask_login.logout_user()
    return redirect("http://127.0.0.1:3000/login")


# TO REGISTER A NEW USER
@app.route("/auth/register", methods=["POST"])
def register_user():
    try:
        email = request.form.get("email")
        password = request.form.get("password")
        first_name = request.form.get("first_name")
        last_name = request.form.get("last_name")
        date_of_birth = request.form.get("date_of_birth")
    except:
        return "Email, password, name and date of birth are mandatory fields."

    conn = mysql.connect()
    cursor = conn.cursor()

    test = isEmailUnique(email)

    if test:
        fields = ", ".join([i for i in request.form])
        values = "', '".join([request.form[i] for i in request.form])

        cursor.execute(f"INSERT INTO Users ({fields}) VALUES ('{values}')")
        conn.commit()

        cursor.execute(f"SELECT user_id FROM Users WHERE email='{email}'")
        user_id = cursor.fetchone()[0]

        # log user in
        user = User(user_id, email, first_name, last_name)
        flask_login.login_user(user)

        return redirect("http://127.0.0.1:3000/")

    return "Email is already taken"


# ------------------------------------
# --------- FRIENDS ROUTER -----------
# ------------------------------------

# GET ALL FRIENDS OF USER
@app.route("/friends", methods=["GET"])
@flask_login.login_required
def friends():
    user: User = flask_login.current_user
    conn = mysql.connect()
    cursor = conn.cursor()

    # Get friends
    cursor.execute(
        f"SELECT f.friend2, u.first_name, u.last_name FROM Friends f JOIN Users u ON f.friend2=u.user_id WHERE friend1={user.id}"
    )
    friends_list = [
        {"friend_id": a[0], "friend_name": f"{a[1]} {a[2]}"} for a in cursor.fetchall()
    ]
    return jsonify(friends_list)


# SEARCH FOR FRIENDS WITH A GIVEN QUERY
@app.route("/friends/search", methods=["GET"])
@flask_login.login_required
def search_friends():
    user: User = flask_login.current_user
    conn = mysql.connect()
    cursor = conn.cursor()

    search = request.args["search"].split()
    fname = search[0]

    if len(search) == 1:
        cursor.execute(
            f"SELECT user_id, first_name, last_name FROM Users WHERE first_name LIKE '{fname}%' AND user_id<>{user.id}"
        )
    else:
        lname = " ".join(search[1:])
        cursor.execute(
            f"SELECT user_id, first_name, last_name FROM Users WHERE first_name LIKE '{fname}%' AND last_name LIKE '{lname}%' AND user_id<>{user.id}"
        )

    friends_list = [
        {"user_id": a[0], "first_name": a[1], "last_name": a[2]}
        for a in cursor.fetchall()
    ]
    return jsonify(friends_list)


# ADD OR DELETE FRIENDS
@app.route("/friends/edit", methods=["POST"])
@flask_login.login_required
def edit_friends():
    conn = mysql.connect()
    cursor = conn.cursor()

    user: User = flask_login.current_user
    friend_id = request.json["friend_id"]
    value = request.json["value"]

    if value:
        cursor.execute(
            f"INSERT INTO Friends (friend1, friend2) VALUES ({user.id},{friend_id});"
        )
        cursor.execute(
            f"INSERT INTO Friends (friend1, friend2) VALUES ({friend_id},{user.id});"
        )
    else:
        cursor.execute(
            f"DELETE FROM Friends WHERE friend1={user.id} AND friend2={friend_id};"
        )
        cursor.execute(
            f"DELETE FROM Friends WHERE friend1={friend_id} AND friend2={user.id};"
        )
    conn.commit()

    return jsonify("ok")


"""
Get list of friends for a user
"""


@app.route("/friends/<user_id>", methods=["GET"])
@flask_login.login_required
def get_friends(user_id):

    conn = mysql.connect()
    cursor = conn.cursor()

    cursor.execute(
        f"SELECT f.friend2, u.first_name, u.last_name FROM Friends f JOIN Users u ON f.friend2=u.user_id WHERE friend1={user_id}"
    )

    friends_list = [
        {"friend_id": a[0], "friend_name": f"{a[1]} {a[2]}"} for a in cursor.fetchall()
    ]

    return jsonify(friends_list)


# ----------------------------------
# --------- ALBUM ROUTER -----------
# ----------------------------------
@app.route("/albums/imgs", methods=["GET"])
def get_file():
    album_id = request.args.get("album_id")
    filename = request.args.get("filename")
    return send_file(f"./imgs/{album_id}/{filename}")


@app.route("/albums/", methods=["POST"])
@flask_login.login_required
def upload_file():
    conn = mysql.connect()
    cursor = conn.cursor()

    user : User = flask_login.current_user

    fo = request.form
    fi = request.files
    album_name = request.form.get("album_name")

    # Save album to database
    cursor.execute(f"INSERT INTO Albums (user_id, album_name) VALUES ('{user.id}', '{album_name}');")
    conn.commit()
    cursor.execute(f"SELECT album_id FROM Albums WHERE user_id={user.id} AND album_name='{album_name}';")
    album_id = cursor.fetchone()[0]

    # Check if folder exists
    path = f"./imgs/{album_id}/"
    if not os.path.exists(path):
        os.makedirs(path)

    # Save images
    def allowed_file(filename):
        return '.' in filename and filename.rsplit('.', 1)[-1] in ALLOWED_EXTENSIONS

    for img in fi:
        # Captions
        if not allowed_file(img):
            continue

        fi.get(img).save(f"{path}/{img}")
        caption = fo.get("cap_" + img)
        cursor.execute(f'INSERT INTO Photos (album_id, caption, photo_location) VALUES ({album_id}, "{caption}", "{img}");')
        conn.commit()

        # Save tags
        if fo.get("tags_" + img) is None: continue
        tags = fo.get("tags_" + img).split(",")
        
        for tag in tags:
            if tag == '': continue

            # Check if tag exists
            exists = cursor.execute(f"SELECT * FROM Tags WHERE tag='{tag}';")
            if not exists:
                cursor.execute(f"INSERT INTO Tags (tag) VALUES ('{tag}');")
                conn.commit()

            cursor.execute(f"SELECT tag_id FROM Tags WHERE tag='{tag}';")
            tag_id = cursor.fetchone()[0]

            cursor.execute(f'SELECT photo_id FROM Photos WHERE album_id={album_id} AND photo_location="{img}" AND caption="{caption}";')
            photo_id = cursor.fetchone()[0]

            cursor.execute(f"INSERT INTO TagToPhotos (tag_id, photo_id) VALUES ({tag_id}, {photo_id});")
            conn.commit()

    return "Success."
        
@app.route('/albums/delete', methods=['POST'])
@flask_login.login_required
def delete_album():
    conn = mysql.connect()
    cursor = conn.cursor()

    user: User = flask_login.current_user
    album_id = request.json["album_id"]

    cursor.execute(f"SELECT user_id FROM Albums WHERE album_id={album_id}")
    owner = cursor.fetchone()[0]

    if owner == user.id:
        cursor.execute(f"DELETE FROM Albums WHERE album_id={album_id}")
        conn.commit()

        shutil.rmtree(f"./imgs/{album_id}/")

    return "Success."

@app.route('/albums/delete-photo', methods=['POST'])
@flask_login.login_required
def delete_photo():
    conn = mysql.connect()
    cursor = conn.cursor()

    user: User = flask_login.current_user
    photo_id = request.json["photo_id"]

    cursor.execute(f"SELECT user_id, P.album_id, P.photo_location FROM Photos P JOIN Albums A ON P.album_id=A.album_id WHERE P.photo_id={photo_id}")
    owner, album_id, photo_location = cursor.fetchone()


    if owner == user.id:
        cursor.execute(f"DELETE FROM Photos WHERE photo_id={photo_id}")
        conn.commit()

        os.remove(f"./imgs/{album_id}/{photo_location}")

    return "Success."

@app.route("/albums/", methods=["GET"])
def get_album():
    album_id = int(request.args.get("album_id"))
    conn = mysql.connect()
    cursor = conn.cursor()
    cursor.execute(
        f"SELECT a.album_name, u.user_id, u.first_name, u.last_name FROM Albums a JOIN Users u ON a.user_id=u.user_id WHERE a.album_id={album_id}"
    )
    r = cursor.fetchone()

    album = {
        "album_id": album_id,
        "album_name": r[0],
        "user_id": r[1],
        "user_name": f"{r[2]} {r[3]}",
        "images": get_album_images(album_id),
    }

    return jsonify(album)

def process_images(image_list):
    conn = mysql.connect()
    cursor = conn.cursor()

    images = []
    for img in image_list:
        obj = {"photo_id": img[0], "caption": img[1], "filename": img[2]}
        
        # LIKES
        cursor.execute(f"SELECT first_name, last_name FROM Likes l JOIN Users u ON l.user_id=u.user_id where l.photo_id={img[0]};")
        likes = [f"{a[0]} {a[1]}" for a in cursor.fetchall()]
        obj["likes"] = likes
        obj["num_likes"] = len(likes)

        # COMMENTS
        cursor.execute(
            f"SELECT first_name, last_name, text FROM Comments c JOIN Users u ON c.user_id=u.user_id where c.photo_id={img[0]};"
        )
        comments = [{"user": f"{a[0]} {a[1]}", "text": a[2]} for a in cursor.fetchall()]
        obj["comments"] = comments
        obj["num_comments"] = len(comments)

        images.append(obj)

    return images

def get_album_images(album_id):
    conn = mysql.connect()
    cursor = conn.cursor()

    cursor.execute(f"SELECT photo_id, caption, photo_location FROM Photos WHERE album_id={album_id}")
    result = cursor.fetchall()
    images = process_images(result)
    return images


@app.route("/albums/mine", methods=["GET"])
@flask_login.login_required
def get_my_albums():
    conn = mysql.connect()
    cursor = conn.cursor()

    user: User = flask_login.current_user

    cursor.execute(
        f"SELECT album_id, album_name, user_id FROM Albums WHERE user_id={user.id}"
    )
    result = cursor.fetchall()
    albums = [
        {
            "album_id": a[0],
            "album_name": a[1],
            "user_id": a[2],
            "user_name": "me",
            "images": get_album_images(a[0]),
        }
        for a in result
    ]

    return jsonify(albums)


@app.route("/albums/like", methods=["POST"])
@flask_login.login_required
def like_image():
    conn = mysql.connect()
    cursor = conn.cursor()

    user: User = flask_login.current_user
    photo_id = request.json["photo_id"]
    like = request.json["value"]

    cursor.execute(f"SELECT user_id FROM Photos P JOIN Albums A ON P.album_id=A.album_id WHERE P.photo_id={photo_id}")
    owner = cursor.fetchone()[0]

    if owner != user.id:
        already_liked = cursor.execute(
            f"SELECT * FROM Likes WHERE user_id={user.id} AND photo_id={photo_id}"
        )

        if like and not already_liked:
            cursor.execute(
                f"INSERT INTO Likes (user_id, photo_id) VALUES ({user.id},{photo_id});"
            )
            conn.commit()
        elif not like and already_liked:
            cursor.execute(
                f"DELETE FROM Likes WHERE user_id={user.id} AND photo_id={photo_id}"
            )
            conn.commit()

        return "success"
    else:
        return "error"


@app.route("/albums/comment", methods=["POST"])
def comment_image():
    conn = mysql.connect()
    cursor = conn.cursor()

    photo_id = request.json["photo_id"]
    text = request.json["text"]

    cursor.execute(f"SELECT user_id FROM Photos P JOIN Albums A ON P.album_id=A.album_id WHERE P.photo_id={photo_id}")
    owner = cursor.fetchone()[0]

    try:
        user: User = flask_login.current_user
        if owner != user.id:
            cursor.execute(
                f"INSERT INTO Comments (user_id, photo_id, text) VALUES ({user.id}, {photo_id}, '{text}');"
            )
            conn.commit()

            return "success"
        else:
            return "error"
    except:
        cursor.execute(
                f"INSERT INTO Comments (user_id, photo_id, text) VALUES (5, {photo_id}, '{text}');"
            )
        conn.commit()
        return "success"


@app.route("/albums/general-feed", methods=["GET"])
def get_general_feed():
    conn = mysql.connect()
    cursor = conn.cursor()

    cursor.execute(
        f"""
            SELECT a.album_id, a.album_name, a.user_id, u.first_name, u.last_name
            FROM Albums a
            JOIN Users u on a.user_id=u.user_id
            ORDER BY date_created DESC
            LIMIT 10;
        """
    )
    result = cursor.fetchall()

    albums = [
        {
            "album_id": a[0],
            "album_name": a[1],
            "user_id": a[2],
            "user_name": f"{a[3]} {a[4]}",
            "images": get_album_images(a[0]),
        }
        for a in result
    ]

    return jsonify(albums)


@app.route("/albums/friends-feed", methods=["GET"])
@flask_login.login_required
def get_friends_feed():
    conn = mysql.connect()
    cursor = conn.cursor()

    user: User = flask_login.current_user
    cursor.execute(
        f"""
        SELECT a.album_id, a.album_name, a.user_id, u.first_name, u.last_name
        FROM Albums a
        JOIN Friends f ON a.user_id=f.friend2
        JOIN Users u on a.user_id=u.user_id
        WHERE f.friend1={user.id}
        LIMIT 10
    """
    )
    result = cursor.fetchall()

    albums = [
        {
            "album_id": a[0],
            "album_name": a[1],
            "user_id": a[2],
            "user_name": f"{a[3]} {a[4]}",
            "images": get_album_images(a[0]),
        }
        for a in result
    ]

    return jsonify(albums)


@app.route("/albums/add-picture", methods=["POST"])
@flask_login.login_required
def add_picture():
    conn = mysql.connect()
    cursor = conn.cursor()

    user : User = flask_login.current_user
    cursor.execute(f'SELECT user_id FROM Albums A WHERE A.user_id={user.id}')
    album_owner = cursor.fetchone()[0]
    fi = request.files

    if user.id != album_owner: return "Error."

    for i in fi:
        image = i
        break

    album_id = request.form.get("album_id")
    caption = request.form.get("cap")
    tags = request.form.get("tags").split(",")

    # Check if folder exists
    path = f"./imgs/{album_id}/"
    if not os.path.exists(path):
        os.makedirs(path)

    # Save images
    def allowed_file(filename):
        return '.' in filename and filename.rsplit('.', 1)[-1] in ALLOWED_EXTENSIONS

    # Captions
    if not allowed_file(image):
        return "Success."

    fi.get(image).save(f"{path}/{image}")
    cursor.execute(f'INSERT INTO Photos (album_id, caption, photo_location) VALUES ({album_id}, "{caption}", "{image}");')
    conn.commit()
    
    for tag in tags:
        if tag == '': continue

        # Check if tag exists
        exists = cursor.execute(f"SELECT * FROM Tags WHERE tag='{tag}';")
        if not exists:
            cursor.execute(f"INSERT INTO Tags (tag) VALUES ('{tag}');")
            conn.commit()

        cursor.execute(f"SELECT tag_id FROM Tags WHERE tag='{tag}';")
        tag_id = cursor.fetchone()[0]

        cursor.execute(f'SELECT photo_id FROM Photos WHERE album_id={album_id} AND photo_location="{image}" AND caption="{caption}";')
        photo_id = cursor.fetchone()[0]

        cursor.execute(f"INSERT INTO TagToPhotos (tag_id, photo_id) VALUES ({tag_id}, {photo_id});")
        conn.commit()

    return "Success."

# ----------------------------------
# --------- RECOMMENDATIONS --------
# ----------------------------------
@app.route("/recommendations/friends", methods=["GET"])
@flask_login.login_required
def get_friend_recommendations():

    user: User = flask_login.current_user
    conn = mysql.connect()
    cursor = conn.cursor()

    cursor.execute(f"""
        SELECT DISTINCT f2.friend2, u.first_name, u.last_name
        FROM Friends f1 JOIN Friends f2 JOIN Users u
        ON f1.friend2 = f2.friend1 AND f2.friend2=u.user_id
        WHERE NOT EXISTS (
            SELECT 1
            FROM Friends f
            WHERE f.friend1 = f1.friend1 AND f.friend2 = f2.friend2
        ) AND f1.friend1 <> f2.friend2 AND f1.friend1 = {user.id};
    """)
    friends_of_friends = [
        {"fof_id": a[0], "fof_name": f"{a[1]} {a[2]}"} for a in cursor.fetchall()
    ]

    return jsonify(friends_of_friends)


@app.route("/recommendations/photos", methods=["GET"])
@flask_login.login_required
def get_photo_recommendations():
    """
    Returns list of photos "you might like" based on your previous
    history of liking photos.
    Implementation:: Get tags of currently liked photos and check
    for photos in the same tag (maybe also check for similar tags w/
    regex) and return the photos in the tag you haven't liked before
    """
    user: User = flask_login.current_user

    conn = mysql.connect()
    cursor = conn.cursor()

    cursor.execute(f"""
    SELECT TT.tag_id
    FROM TagToPhotos TT JOIN Photos P JOIN Albums A
    ON TT.photo_id = P.photo_id AND P.album_id = A.album_id
    WHERE A.user_id={user.id}
    GROUP BY tag_id
    ORDER BY COUNT(*) DESC
    LIMIT 5
    """)
    five_tags = ','.join([str(x[0]) for x in cursor.fetchall()])

    cursor.execute(f"""
    SELECT OP.album_id, OP.photo_location
    FROM (
        SELECT P.photo_id, P.album_id, P.photo_location
        FROM TagToPhotos TT JOIN Photos P
        ON TT.photo_id=P.photo_id
        GROUP BY photo_id
        ORDER BY COUNT(*) ASC
    ) AS OP
    JOIN TagToPhotos TT JOIN Tags T JOIN Albums A
    ON TT.photo_id=OP.photo_id AND TT.tag_id=T.tag_id AND OP.album_id=A.album_id
    WHERE T.tag_id IN ({five_tags}) AND A.user_id <> {user.id}
    GROUP BY OP.album_id, OP.photo_location
    ORDER BY COUNT(T.tag) DESC
    """)

    result = [{"album_id": a[0], "photo_location": a[1]} for a in cursor.fetchall()]

    return jsonify(result)

# ---------------------------------
# --------- POPULAR ---------------
# ---------------------------------
@app.route("/active", methods=["GET"])
def most_active():

    conn = mysql.connect()
    cursor = conn.cursor()

    # TODO: most photos uploaded and most comments left
    # FIXME: combine two SQL statements to get final count

    final_SQL_Query = f"""
    SELECT final.first, final.second, final.UID1 as user_id, SUM(COALESCE(NoOfPhotos, 0) + COALESCE(NoOfComments,0)) as FinalScore FROM (
        SELECT DISTINCT *
        FROM (
            SELECT COUNT(a.user_id) as NoOfPhotos, a.user_id as uidPhotos, u.user_id as UID1
            FROM Albums a JOIN Photos b
            ON a.album_id=b.album_id RIGHT JOIN Users u ON a.user_id=u.user_id
            GROUP BY u.user_id
            ORDER BY COUNT(a.user_id)
        ) AS one LEFT OUTER JOIN (
            SELECT COUNT(c.user_id) as NoOfComments, c.user_id as uidComments, u.user_id as UID2, u.first_name as first, u.last_name as second
            FROM Comments c RIGHT JOIN Users u ON c.user_id=u.user_id
            GROUP BY u.user_id ORDER BY COUNT(c.user_id)
        ) AS two ON one.UID1 = two.UID2
    ) AS final
    WHERE final.UID1 <> 5
    GROUP BY final.UID1
    ORDER BY FinalScore DESC LIMIT 10;
    """

    cursor.execute(final_SQL_Query)
    list_of_most_active = [
        {"name": f"{a[0]} {a[1]}", "user_id": a[2], "Final_Contribution": a[3]}
        for a in cursor.fetchall()
    ]

    return jsonify(list_of_most_active)


@app.route("/tags/popular", methods=["GET"])
def most_popular_tags():

    conn = mysql.connect()
    cursor = conn.cursor()

    FINAL_SQL_QUERY = f"""
    SELECT COUNT(TT.photo_id) as Popular, T.tag
    FROM TagToPhotos TT JOIN Tags T
    ON TT.tag_id=T.tag_id
    GROUP BY (T.tag)
    HAVING COUNT(TT.photo_id) = (
        SELECT MAX(M)
        FROM (
            SELECT T.tag, COUNT(TT.photo_id) as M
            FROM TagToPhotos TT JOIN Tags T
            ON TT.tag_id = T.tag_id
            GROUP BY (T.tag)
        ) AS Counts
    )
    """

    cursor.execute(FINAL_SQL_QUERY)
    list_of_most_popular_tags = [
        {"count": a[0], "tag": a[1]} for a in cursor.fetchall()
    ]

    return jsonify(list_of_most_popular_tags)

# ---------------------------------
# --------- SEARCHING ON ----------
# ---------------------------------
@app.route("/search/comments", methods=["GET"])
def search_comments():

    conn = mysql.connect()
    cursor = conn.cursor()

    search = request.args["search"]
    print(search)
    QUERY = f"""SELECT u.first_name, u.last_name, u.user_id, COUNT(c.text) as NoOfComments FROM Comments c JOIN Users u ON c.user_id = u.user_id WHERE BINARY c.text='{search}' GROUP BY u.user_id ORDER BY NoOfComments DESC;"""
    cursor.execute(QUERY)

    comment_list = [
        {"user_id": a[2], "user_name": f"{a[0]} {a[1]}", "NoOfComments": a[3]}
        for a in cursor.fetchall()
    ]

    return jsonify(comment_list)


@app.route("/search/tags", methods=["GET"])
def search_tags():
    conn = mysql.connect()
    cursor = conn.cursor()
    search = request.args["search"].split()
    images_list = {"mine": [], "others": []}
    user_exists = False

    try:
        user_exists = True
        user: User = flask_login.current_user
        MY_PHOTOS_QUERY = f"""
            SELECT P.album_id, P.photo_location, A.user_id
            FROM TAGS T JOIN TagToPhotos TT JOIN Photos P JOIN Albums A
            ON T.tag_id = TT.tag_id AND TT.photo_id = P.photo_id AND A.album_id=P.album_id
            WHERE T.tag IN ("{'","'.join(search)}") AND A.user_id={user.id}
            GROUP BY TT.photo_id
            HAVING COUNT(T.tag) = {len(search)};
        """
        cursor.execute(MY_PHOTOS_QUERY)
        images_list["mine"] = [{"album_id": a[0], "photo_location": a[1], "user_id": a[2]} for a in cursor.fetchall()]
        print(images_list["mine"])

    except Exception as e:
        user_exists = False
        user = None
        ALL_PHOTOS_QUERY = f"""
            SELECT P.album_id, P.photo_location, A.user_id FROM TAGS T JOIN TagToPhotos TT JOIN Photos P ON T.tag_id = TT.tag_id AND TT.photo_id = P.photo_id JOIN Albums A ON A.album_id=P.album_id WHERE T.tag IN ("{'","'.join(search)}") GROUP BY TT.photo_id HAVING COUNT(T.tag) = {len(search)};
        """
        cursor.execute(ALL_PHOTOS_QUERY)
        for a in cursor.fetchall():
            images_list["others"].append(
                {"album_id": a[0], "photo_location": a[1], "user_id": a[2]}
            )

    if user_exists:
        ALL_OTHER_PHOTOS_QUERY = f"""
            SELECT P.album_id, P.photo_location, A.user_id FROM TAGS T JOIN TagToPhotos TT JOIN Photos P ON T.tag_id = TT.tag_id AND TT.photo_id = P.photo_id JOIN Albums A ON A.album_id=P.album_id WHERE T.tag IN ("{'","'.join(search)}") AND A.user_id <> {user.id} GROUP BY TT.photo_id HAVING COUNT(T.tag) = {len(search)};
        """
        cursor.execute(ALL_OTHER_PHOTOS_QUERY)

        for a in cursor.fetchall():
            images_list["others"].append(
                {"album_id": a[0], "photo_location": a[1], "user_id": a[2]}
            )

    return jsonify(images_list)

# ---------------------------------
# --------- MAIN ROUTER -----------
# ---------------------------------
@app.route("/whoami", methods=["GET"])
@flask_login.login_required
def whoami():
    user: User = flask_login.current_user

    data = {
        "user_id": user.id,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email,
    }

    return jsonify(data)


@app.route("/", methods=["GET"])
def slash():
    return "Server running..."


if __name__ == "__main__":
    app.run(port=5000, debug=True)
