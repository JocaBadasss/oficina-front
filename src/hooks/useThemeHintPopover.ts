import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';

interface Props {
  dropdownOpen: boolean;
}

export function useThemeHintPopover({ dropdownOpen }: Props) {
  const [showPopover, setShowPopover] = useState(false);

  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });

  useEffect(() => {
    const hasSeenHint = localStorage.getItem('hasSeenThemeHint');

    if (!hasSeenHint) {
      if (isMobile) {
        if (dropdownOpen) {
          setShowPopover(true);
        }
      } else {
        setTimeout(() => setShowPopover(true), 2000);
      }
    }
  }, [isMobile, dropdownOpen]);

  const dismissPopover = () => {
    localStorage.setItem('hasSeenThemeHint', 'true');
    setShowPopover(false);
  };

  return { showPopover, dismissPopover, isMobile };
}
