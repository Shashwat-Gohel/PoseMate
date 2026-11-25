export interface PoseEntry {
  id: string;
  image: any;
  caption: string;
}

export interface PoseCategory {
  id: string;
  title: string;
  emoji: string;
  poses: PoseEntry[];
}

export const POSE_CATEGORIES: PoseCategory[] = [
  {
    id: 'beach',
    title: 'Beach & Ocean',
    emoji: '🏖️',
    poses: [
      { id: 'men-beach-01', image: require('@/assets/poses/men/beach/pose-01.jpg'), caption: 'Pose 1' },
      { id: 'men-beach-02', image: require('@/assets/poses/men/beach/pose-02.jpg'), caption: 'Pose 2' },
      { id: 'men-beach-03', image: require('@/assets/poses/men/beach/pose-03.jpg'), caption: 'Pose 3' },
      { id: 'men-beach-04', image: require('@/assets/poses/men/beach/pose-04.jpg'), caption: 'Pose 4' },
      { id: 'men-beach-05', image: require('@/assets/poses/men/beach/pose-05.jpg'), caption: 'Pose 5' },
      { id: 'men-beach-06', image: require('@/assets/poses/men/beach/pose-06.jpg'), caption: 'Pose 6' },
      { id: 'men-beach-07', image: require('@/assets/poses/men/beach/pose-07.jpg'), caption: 'Pose 7' },
      { id: 'men-beach-08', image: require('@/assets/poses/men/beach/pose-08.jpg'), caption: 'Pose 8' },
      { id: 'men-beach-09', image: require('@/assets/poses/men/beach/pose-09.jpg'), caption: 'Pose 9' },
      { id: 'men-beach-10', image: require('@/assets/poses/men/beach/pose-10.jpg'), caption: 'Pose 10' },
    ],
  },
  {
    id: 'mountains',
    title: 'Mountains & Hiking',
    emoji: '🏔️',
    poses: [
      { id: 'men-mountains-01', image: require('@/assets/poses/men/mountains/pose-01.jpg'), caption: 'Pose 1' },
      { id: 'men-mountains-02', image: require('@/assets/poses/men/mountains/pose-02.jpg'), caption: 'Pose 2' },
      { id: 'men-mountains-03', image: require('@/assets/poses/men/mountains/pose-03.jpg'), caption: 'Pose 3' },
      { id: 'men-mountains-04', image: require('@/assets/poses/men/mountains/pose-04.jpg'), caption: 'Pose 4' },
      { id: 'men-mountains-05', image: require('@/assets/poses/men/mountains/pose-05.jpg'), caption: 'Pose 5' },
      { id: 'men-mountains-06', image: require('@/assets/poses/men/mountains/pose-06.jpg'), caption: 'Pose 6' },
      { id: 'men-mountains-07', image: require('@/assets/poses/men/mountains/pose-07.jpg'), caption: 'Pose 7' },
      { id: 'men-mountains-08', image: require('@/assets/poses/men/mountains/pose-08.jpg'), caption: 'Pose 8' },
      { id: 'men-mountains-09', image: require('@/assets/poses/men/mountains/pose-09.jpg'), caption: 'Pose 9' },
      { id: 'men-mountains-10', image: require('@/assets/poses/men/mountains/pose-10.jpg'), caption: 'Pose 10' },
    ],
  },
  {
    id: 'city',
    title: 'City & Urban',
    emoji: '🌆',
    poses: [
      { id: 'men-city-01', image: require('@/assets/poses/men/city/pose-01.jpg'), caption: 'Pose 1' },
      { id: 'men-city-02', image: require('@/assets/poses/men/city/pose-02.jpg'), caption: 'Pose 2' },
      { id: 'men-city-03', image: require('@/assets/poses/men/city/pose-03.jpg'), caption: 'Pose 3' },
      { id: 'men-city-04', image: require('@/assets/poses/men/city/pose-04.jpg'), caption: 'Pose 4' },
      { id: 'men-city-05', image: require('@/assets/poses/men/city/pose-05.jpg'), caption: 'Pose 5' },
      { id: 'men-city-06', image: require('@/assets/poses/men/city/pose-06.jpg'), caption: 'Pose 6' },
      { id: 'men-city-07', image: require('@/assets/poses/men/city/pose-07.jpg'), caption: 'Pose 7' },
      { id: 'men-city-08', image: require('@/assets/poses/men/city/pose-08.jpg'), caption: 'Pose 8' },
      { id: 'men-city-09', image: require('@/assets/poses/men/city/pose-09.jpg'), caption: 'Pose 9' },
      { id: 'men-city-10', image: require('@/assets/poses/men/city/pose-10.jpg'), caption: 'Pose 10' },
    ],
  },
  {
    id: 'cafe',
    title: 'Café & Lifestyle',
    emoji: '☕',
    poses: [
      { id: 'men-cafe-01', image: require('@/assets/poses/men/cafe/pose-01.jpg'), caption: 'Pose 1' },
      { id: 'men-cafe-02', image: require('@/assets/poses/men/cafe/pose-02.jpg'), caption: 'Pose 2' },
      { id: 'men-cafe-03', image: require('@/assets/poses/men/cafe/pose-03.jpg'), caption: 'Pose 3' },
      { id: 'men-cafe-04', image: require('@/assets/poses/men/cafe/pose-04.jpg'), caption: 'Pose 4' },
      { id: 'men-cafe-05', image: require('@/assets/poses/men/cafe/pose-05.jpg'), caption: 'Pose 5' },
      { id: 'men-cafe-06', image: require('@/assets/poses/men/cafe/pose-06.jpg'), caption: 'Pose 6' },
      { id: 'men-cafe-07', image: require('@/assets/poses/men/cafe/pose-07.jpg'), caption: 'Pose 7' },
      { id: 'men-cafe-08', image: require('@/assets/poses/men/cafe/pose-08.jpg'), caption: 'Pose 8' },
      { id: 'men-cafe-09', image: require('@/assets/poses/men/cafe/pose-09.jpg'), caption: 'Pose 9' },
      { id: 'men-cafe-10', image: require('@/assets/poses/men/cafe/pose-10.jpg'), caption: 'Pose 10' },
    ],
  },
  {
    id: 'sunset',
    title: 'Sunset & Golden Hour',
    emoji: '🌅',
    poses: [
      { id: 'men-sunset-01', image: require('@/assets/poses/men/sunset/pose-01.jpg'), caption: 'Pose 1' },
      { id: 'men-sunset-02', image: require('@/assets/poses/men/sunset/pose-02.jpg'), caption: 'Pose 2' },
      { id: 'men-sunset-03', image: require('@/assets/poses/men/sunset/pose-03.jpg'), caption: 'Pose 3' },
      { id: 'men-sunset-04', image: require('@/assets/poses/men/sunset/pose-04.jpg'), caption: 'Pose 4' },
      { id: 'men-sunset-05', image: require('@/assets/poses/men/sunset/pose-05.jpg'), caption: 'Pose 5' },
      { id: 'men-sunset-06', image: require('@/assets/poses/men/sunset/pose-06.jpg'), caption: 'Pose 6' },
      { id: 'men-sunset-07', image: require('@/assets/poses/men/sunset/pose-07.jpg'), caption: 'Pose 7' },
      { id: 'men-sunset-08', image: require('@/assets/poses/men/sunset/pose-08.jpg'), caption: 'Pose 8' },
      { id: 'men-sunset-09', image: require('@/assets/poses/men/sunset/pose-09.jpg'), caption: 'Pose 9' },
      { id: 'men-sunset-10', image: require('@/assets/poses/men/sunset/pose-10.jpg'), caption: 'Pose 10' },
    ],
  },
  {
    id: 'monuments',
    title: 'Monuments & Travel',
    emoji: '🏛️',
    poses: [
      { id: 'men-monuments-01', image: require('@/assets/poses/men/monuments/pose-01.jpg'), caption: 'Pose 1' },
      { id: 'men-monuments-02', image: require('@/assets/poses/men/monuments/pose-02.jpg'), caption: 'Pose 2' },
      { id: 'men-monuments-03', image: require('@/assets/poses/men/monuments/pose-03.jpg'), caption: 'Pose 3' },
      { id: 'men-monuments-04', image: require('@/assets/poses/men/monuments/pose-04.jpg'), caption: 'Pose 4' },
      { id: 'men-monuments-05', image: require('@/assets/poses/men/monuments/pose-05.jpg'), caption: 'Pose 5' },
      { id: 'men-monuments-06', image: require('@/assets/poses/men/monuments/pose-06.jpg'), caption: 'Pose 6' },
      { id: 'men-monuments-07', image: require('@/assets/poses/men/monuments/pose-07.jpg'), caption: 'Pose 7' },
      { id: 'men-monuments-08', image: require('@/assets/poses/men/monuments/pose-08.jpg'), caption: 'Pose 8' },
      { id: 'men-monuments-09', image: require('@/assets/poses/men/monuments/pose-09.jpg'), caption: 'Pose 9' },
      { id: 'men-monuments-10', image: require('@/assets/poses/men/monuments/pose-10.jpg'), caption: 'Pose 10' },
    ],
  },
  {
    id: 'roadtrip',
    title: 'Car & Road Trip',
    emoji: '🚗',
    poses: [
      { id: 'men-roadtrip-01', image: require('@/assets/poses/men/roadtrip/pose-01.jpg'), caption: 'Pose 1' },
      { id: 'men-roadtrip-02', image: require('@/assets/poses/men/roadtrip/pose-02.jpg'), caption: 'Pose 2' },
      { id: 'men-roadtrip-03', image: require('@/assets/poses/men/roadtrip/pose-03.jpg'), caption: 'Pose 3' },
      { id: 'men-roadtrip-04', image: require('@/assets/poses/men/roadtrip/pose-04.jpg'), caption: 'Pose 4' },
      { id: 'men-roadtrip-05', image: require('@/assets/poses/men/roadtrip/pose-05.jpg'), caption: 'Pose 5' },
      { id: 'men-roadtrip-06', image: require('@/assets/poses/men/roadtrip/pose-06.jpg'), caption: 'Pose 6' },
      { id: 'men-roadtrip-07', image: require('@/assets/poses/men/roadtrip/pose-07.jpg'), caption: 'Pose 7' },
      { id: 'men-roadtrip-08', image: require('@/assets/poses/men/roadtrip/pose-08.jpg'), caption: 'Pose 8' },
      { id: 'men-roadtrip-09', image: require('@/assets/poses/men/roadtrip/pose-09.jpg'), caption: 'Pose 9' },
      { id: 'men-roadtrip-10', image: require('@/assets/poses/men/roadtrip/pose-10.jpg'), caption: 'Pose 10' },
    ],
  },
  {
    id: 'festive',
    title: 'Party & Festive',
    emoji: '🎉',
    poses: [
      { id: 'men-festive-01', image: require('@/assets/poses/men/festive/pose-01.jpg'), caption: 'Pose 1' },
      { id: 'men-festive-02', image: require('@/assets/poses/men/festive/pose-02.jpg'), caption: 'Pose 2' },
      { id: 'men-festive-03', image: require('@/assets/poses/men/festive/pose-03.jpg'), caption: 'Pose 3' },
      { id: 'men-festive-04', image: require('@/assets/poses/men/festive/pose-04.jpg'), caption: 'Pose 4' },
      { id: 'men-festive-05', image: require('@/assets/poses/men/festive/pose-05.jpg'), caption: 'Pose 5' },
      { id: 'men-festive-06', image: require('@/assets/poses/men/festive/pose-06.jpg'), caption: 'Pose 6' },
      { id: 'men-festive-07', image: require('@/assets/poses/men/festive/pose-07.jpg'), caption: 'Pose 7' },
      { id: 'men-festive-08', image: require('@/assets/poses/men/festive/pose-08.jpg'), caption: 'Pose 8' },
      { id: 'men-festive-09', image: require('@/assets/poses/men/festive/pose-09.jpg'), caption: 'Pose 9' },
      { id: 'men-festive-10', image: require('@/assets/poses/men/festive/pose-10.jpg'), caption: 'Pose 10' },
    ],
  },
];

export function getCategories(): PoseCategory[] {
  return POSE_CATEGORIES;
}

export function getCategory(categoryId: string): PoseCategory | undefined {
  return POSE_CATEGORIES.find((cat) => cat.id === categoryId);
}
