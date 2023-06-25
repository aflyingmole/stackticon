import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Button, ButtonGroup, MenuItem } from '@mui/material';
import { Fragment, useRef, useState } from 'react';
import type { LocationState } from 'types/location';
import { makeUrlIntoBracket, makeUrlIntoImgTag } from 'utils/resultUrl';

import { OptionListContainer } from './OptionListContainer';

const copyOptions = ['copy for readme', 'copy link only', 'copy img tag'];

interface ButtonOptionProps {
  state: LocationState;
  setOpenToast: React.Dispatch<React.SetStateAction<boolean>>;
}
const ButtonOptions = ({ state, setOpenToast }: ButtonOptionProps) => {
  const [openOptions, setOpenOptions] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  const selectedOption = useRef(0);

  const bracketUrl = makeUrlIntoBracket(state.url);
  const imgTagUrl = makeUrlIntoImgTag(state.url);

  const clickCopyUrl = async () => {
    const selected = copyOptions[selectedOption.current];
    let copyText = '';

    if (selected.includes('readme')) {
      copyText = bracketUrl;
    } else if (selected.includes('tag')) {
      copyText = imgTagUrl;
    } else {
      copyText = state.url;
    }
    await navigator.clipboard.writeText(copyText);
    setOpenToast(true);
  };

  const clickCopyOption = (e: React.MouseEvent<HTMLLIElement, MouseEvent>, index: number) => {
    selectedOption.current = index;
    setOpenOptions(false);
    clickCopyUrl();
  };

  const handleToggle = () => {
    setOpenOptions((prev) => !prev);
  };

  const handleClose = (e: Event) => {
    if (buttonRef.current && buttonRef.current.contains(e.target as HTMLElement)) {
      return;
    }
    setOpenOptions(false);
  };

  return (
    <Fragment>
      <ButtonGroup
        ref={buttonRef}
        aria-label='button with options'
        variant='contained'
        size='large'
        sx={{
          backgroundColor: 'p.1',
          borderRadius: '12px',
          marginRight: '10px',
        }}
      >
        <Button
          onClick={clickCopyUrl}
          sx={{ borderRadius: '12px 0 0 12px', fontSize: '18px', fontWeight: 'bold' }}
        >
          {copyOptions[selectedOption.current]}
        </Button>
        <Button
          size='small'
          aria-controls={openOptions ? 'split-button-menu' : undefined}
          aria-expanded={openOptions ? 'true' : undefined}
          aria-label='select copy options'
          aria-haspopup='menu'
          onClick={handleToggle}
          sx={{
            borderRadius: '0 12px 12px 0',
          }}
        >
          <ArrowDropDownIcon
            sx={{
              fontSize: '36px',
            }}
          />
        </Button>
      </ButtonGroup>

      {openOptions && (
        <OptionListContainer buttonRef={buttonRef.current} handleClose={handleClose}>
          {copyOptions.map((option, idx) => (
            <MenuItem
              key={option + idx}
              selected={idx === selectedOption.current}
              onClick={(e) => clickCopyOption(e, idx)}
            >
              {option}
            </MenuItem>
          ))}
        </OptionListContainer>
      )}
    </Fragment>
  );
};

export default ButtonOptions;
