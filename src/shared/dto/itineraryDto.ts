export interface MealDto {
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
  _id: string;
}


export interface DayDto {
  dayNumber: number;
  title: string;
  description: string;
  activities: string[]; 
  transfers: string[];
  meals: MealDto;
  _id: string;
}


export interface ItineraryEditDto {
  days: DayDto[];
}
