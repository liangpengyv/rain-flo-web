import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";

ConfirmDateDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  value: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
};

export default function ConfirmDateDialog(props) {
  const { open, onClose, value: valueProp, options, title } = props;
  const [value, setValue] = useState(valueProp);

  useEffect(() => {
    if (!open) setValue(valueProp);
  }, [open, valueProp]);

  function handleChange(event) {
    setValue(event.target.value);
  }

  return (
    <Dialog open={open}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent style={{ maxHeight: 200 }}>
        <RadioGroup value={value} onChange={handleChange}>
          {options.map((option) => (
            <FormControlLabel
              value={option}
              key={option}
              control={<Radio />}
              label={option}
            />
          ))}
        </RadioGroup>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={() => onClose()}>
          Cancel
        </Button>
        <Button onClick={() => onClose(value)}>Ok</Button>
      </DialogActions>
    </Dialog>
  );
}
