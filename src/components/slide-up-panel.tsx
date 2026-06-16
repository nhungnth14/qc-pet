import type { ReactNode } from 'react';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import * as React from 'react';

import colors from '@/components/ui/colors';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  snapPoints?: (string | number)[];
};

/**
 * SlideUpPanel — panel trượt lên, wrap @gorhom/bottom-sheet (controlled qua `isOpen`).
 * UX: chỉ mở 1 panel tại 1 thời điểm (caller đảm bảo). Vuốt xuống để đóng.
 */
export function SlideUpPanel({ isOpen, onClose, children, snapPoints }: Props) {
  const ref = React.useRef<BottomSheet>(null);
  const points = React.useMemo(() => snapPoints ?? ['50%'], [snapPoints]);

  React.useEffect(() => {
    if (isOpen)
      ref.current?.expand();
    else
      ref.current?.close();
  }, [isOpen]);

  return (
    <BottomSheet
      ref={ref}
      index={isOpen ? 0 : -1}
      snapPoints={points}
      enablePanDownToClose
      onClose={onClose}
      backgroundStyle={{ borderRadius: 16, borderWidth: 3, borderColor: colors.cardBorder }}
      backdropComponent={props => (
        <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />
      )}
    >
      <BottomSheetView className="flex-1 px-4 pb-6">{children}</BottomSheetView>
    </BottomSheet>
  );
}
