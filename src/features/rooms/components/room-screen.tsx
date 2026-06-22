import type { RoomType } from '../stores/use-room-navigation';
import { StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { GardenCinematic } from '@/features/garden/components/garden-cinematic';
import { BugsyCharacter } from '@/features/pet/components/bugsy-character';
import { CareButton } from '@/features/pet/components/care-button';
import { SouvenirShelf } from '@/features/pet/components/souvenir-shelf';
import { ROOM_CARE } from '@/features/pet/pet-care';
import { ShopPlaceholder } from '@/features/shop/components/shop-placeholder';
import { BedroomSession } from '@/features/spaced-repetition/components/bedroom-session';
import { FlashQuiz } from '@/features/spaced-repetition/components/flash-quiz';
import { SprintDemoCard } from '@/features/sprint/components/sprint-demo-card';
import { ROOM_DEFINITIONS } from '../room-types';
import { useRoomSuggestion } from '../use-room-suggestion';
import { SuggestionBubble } from './suggestion-bubble';

type RoomScreenProps = {
  roomType: RoomType;
};

/**
 * Immersive screen generic cho các phòng non-WorkRoom. Render môi trường + Bugsy + label.
 * Hoạt động riêng của từng phòng tới ở story sau (3-3 idle, Epic 4 care, Epic 8 Bedroom/Bathroom).
 * Long-press Bugsy → suggestion (AC-4).
 */
export function RoomScreen({ roomType }: RoomScreenProps) {
  const def = ROOM_DEFINITIONS[roomType];
  const careAction = ROOM_CARE[roomType];
  const { suggestion, suggest, dismiss } = useRoomSuggestion();

  const bugsyLongPress = Gesture.LongPress()
    .minDuration(500)
    .runOnJS(true)
    .onStart(() => suggest());

  return (
    <View style={[styles.container, { backgroundColor: def.bgColor }]}>
      <View style={styles.header}>
        <Text style={styles.label}>{`${def.emoji} ${def.label}`}</Text>
      </View>

      <View style={styles.body}>
        <GestureDetector gesture={bugsyLongPress}>
          <View style={styles.bugsyWrap}>
            <BugsyCharacter room={roomType} />
          </View>
        </GestureDetector>
        {careAction && <CareButton action={careAction} />}
        {roomType === 'LIVING_ROOM' && <SouvenirShelf />}
        {roomType === 'LIVING_ROOM' && <SprintDemoCard />}
        {roomType === 'BEDROOM' && <BedroomSession />}
        {roomType === 'BATHROOM' && <FlashQuiz />}
        {roomType === 'GARDEN' && <ShopPlaceholder />}
        <Text style={styles.hint}>Vuốt trái/phải để đổi phòng · giữ Bugsy để hỏi gợi ý</Text>
      </View>

      {roomType === 'GARDEN' && <GardenCinematic />}
      <SuggestionBubble suggestion={suggestion} onDismiss={dismiss} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 12,
  },
  label: { fontSize: 16, fontWeight: '800', color: '#001a41' },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 32,
  },
  bugsyWrap: { padding: 12 },
  hint: { fontSize: 13, fontWeight: '600', color: '#3a4a66', textAlign: 'center' },
});
