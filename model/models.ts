export interface Exercise {
    id?: number;
    name: string;
    category: string;
}

export interface ExerciseSet {
    id?: number;
    workoutExerciseID: number;
    setNumber: number; // set number in the exercise workout
    weight: number;
    reps: number;
}

export interface Workout {
    id?: number;
    userID: number; // user id
    startTime: string;
    notes?: string;
}

export interface WorkoutExercise {
    id?: number;
    userId: number; // user id
    workoutId: number;
    exercise: Exercise; // exercise object
    order_index: number; // exercise order in the workout
}

// Additional interfaces for joined data
export interface WorkoutSessionData extends Workout {
    exerciseName: string;
    category: string;
    sets: ExerciseSet[];
}

export interface WorkoutWithExercises extends Workout {
    exercises: WorkoutSessionData[];
}