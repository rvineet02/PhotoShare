import { AiOutlineUserAdd, AiOutlineUserDelete } from "react-icons/ai";
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { blue, red } from "@mui/material/colors";

interface PropTypes {
  added: boolean;
  editFriends(friend_id: number, value: boolean): void;
  id: number;
  name: string;
}

export default function SearchFriend({
  added,
  editFriends,
  id,
  name,
}: PropTypes) {
  return (
    <ListItem disablePadding onClick={() => editFriends(id, !added)}>
      <ListItemButton>
        <ListItemIcon>
          {!added ? (
            <AiOutlineUserAdd style={{ color: blue[500], fontSize: 20 }} />
          ) : (
            <AiOutlineUserDelete style={{ color: red[500], fontSize: 20 }} />
          )}
        </ListItemIcon>
        <ListItemText primary={name} />
      </ListItemButton>
    </ListItem>
  );
}
