import SQLite from 'react-native-sqlite-storage';
import { Platform } from 'react-native';

// Enable promise for SQLite
SQLite.enablePromise(true);

// Database name
const DATABASE_NAME = 'FitnessJournal.db';

// Database location based on platform
const DATABASE_LOCATION = Platform.OS === 'ios' 
  ? 'Library' 
  : 'default';

let dbInstance: SQLite.SQLiteDatabase | null = null;

// Initialize the database
export const initDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  try {
    if (dbInstance) {
      return dbInstance;
    }

    // Open or create the database
    dbInstance = await SQLite.openDatabase({
      name: DATABASE_NAME,
      location: DATABASE_LOCATION,
    });

    console.log('Database initialized successfully');
    
    // Create tables if they don't exist
    await createTables(dbInstance);
    
    return dbInstance;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

// Close the database connection
export const closeDatabase = async (): Promise<void> => {
  try {
    if (dbInstance) {
      await dbInstance.close();
      dbInstance = null;
      console.log('Database closed successfully');
    }
  } catch (error) {
    console.error('Error closing database:', error);
    throw error;
  }
};

// Create database tables
const createTables = async (db: SQLite.SQLiteDatabase): Promise<void> => {
  try {
    // Create Exercise table
    await db.executeSql(`
      CREATE TABLE IF NOT EXISTS exercises (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category TEXT NOT NULL
      );
    `);

    // Create Workout table
    await db.executeSql(`
      CREATE TABLE IF NOT EXISTS workouts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        startTime TEXT NOT NULL,
        endTime TEXT,
        notes TEXT
      );
    `);

    // Create WorkoutExercise table (join table between Workout and Exercise)
    await db.executeSql(`
      CREATE TABLE IF NOT EXISTS workout_exercises (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        workoutId INTEGER NOT NULL,
        exerciseId INTEGER NOT NULL,
        order_index INTEGER NOT NULL,
        FOREIGN KEY (workoutId) REFERENCES workouts (id) ON DELETE CASCADE,
        FOREIGN KEY (exerciseId) REFERENCES exercises (id) ON DELETE RESTRICT
      );
    `);

    // Create ExerciseSet table
    await db.executeSql(`
      CREATE TABLE IF NOT EXISTS exercise_sets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        workoutExerciseID INTEGER NOT NULL,
        setNumber INTEGER NOT NULL,
        weight REAL NOT NULL,
        reps INTEGER NOT NULL,
        FOREIGN KEY (workoutExerciseID) REFERENCES workout_exercises (id) ON DELETE CASCADE
      );
    `);

    console.log('Tables created successfully');
    
    // Seed some initial exercise data
    await seedInitialData(db);
    
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  }
};

// Seed initial exercise data
const seedInitialData = async (db: SQLite.SQLiteDatabase): Promise<void> => {
  try {
    // Check if exercises table is empty
    const [result] = await db.executeSql('SELECT COUNT(*) as count FROM exercises');
    const { count } = result.rows.item(0);
    
    if (count === 0) {
      // Insert basic exercises
      const exercises = [
        { name: 'Bench Press', category: 'Chest' },
        { name: 'Squat', category: 'Legs' },
        { name: 'Deadlift', category: 'Back' },
        { name: 'Pull-up', category: 'Back' },
        { name: 'Push-up', category: 'Chest' },
        { name: 'Shoulder Press', category: 'Shoulders' },
        { name: 'Bicep Curl', category: 'Arms' },
        { name: 'Tricep Extension', category: 'Arms' },
        { name: 'Leg Press', category: 'Legs' },
        { name: 'Lat Pulldown', category: 'Back' }
      ];
      
      for (const exercise of exercises) {
        await db.executeSql(
          'INSERT INTO exercises (name, category) VALUES (?, ?)',
          [exercise.name, exercise.category]
        );
      }
      
      console.log('Initial exercises seeded successfully');
    }
  } catch (error) {
    console.error('Error seeding initial data:', error);
    throw error;
  }
};

// Export database operations
export const DatabaseOperations = {
  // Exercise operations
  getExercises: async (): Promise<any[]> => {
    try {
      const db = await initDatabase();
      const [result] = await db.executeSql('SELECT * FROM exercises ORDER BY category, name');
      
      const exercises = [];
      for (let i = 0; i < result.rows.length; i++) {
        exercises.push(result.rows.item(i));
      }
      
      return exercises;
    } catch (error) {
      console.error('Error getting exercises:', error);
      throw error;
    }
  },
  
  getExerciseById: async (id: number): Promise<any> => {
    try {
      const db = await initDatabase();
      const [result] = await db.executeSql('SELECT * FROM exercises WHERE id = ?', [id]);
      
      if (result.rows.length > 0) {
        return result.rows.item(0);
      }
      
      return null;
    } catch (error) {
      console.error(`Error getting exercise with id ${id}:`, error);
      throw error;
    }
  },
  
  createExercise: async (name: string, category: string): Promise<number> => {
    try {
      const db = await initDatabase();
      const [result] = await db.executeSql(
        'INSERT INTO exercises (name, category) VALUES (?, ?)',
        [name, category]
      );
      
      return result.insertId || 0;
    } catch (error) {
      console.error('Error creating exercise:', error);
      throw error;
    }
  },
  
  // Workout operations
  getWorkouts: async (): Promise<any[]> => {
    try {
      const db = await initDatabase();
      const [result] = await db.executeSql('SELECT * FROM workouts ORDER BY startTime DESC');
      
      const workouts = [];
      for (let i = 0; i < result.rows.length; i++) {
        workouts.push(result.rows.item(i));
      }
      
      return workouts;
    } catch (error) {
      console.error('Error getting workouts:', error);
      throw error;
    }
  },
  
  getWorkoutById: async (id: number): Promise<any> => {
    try {
      const db = await initDatabase();
      const [result] = await db.executeSql('SELECT * FROM workouts WHERE id = ?', [id]);
      
      if (result.rows.length > 0) {
        return result.rows.item(0);
      }
      
      return null;
    } catch (error) {
      console.error(`Error getting workout with id ${id}:`, error);
      throw error;
    }
  },
  
  createWorkout: async (startTime: string, notes?: string): Promise<number> => {
    try {
      const db = await initDatabase();
      const [result] = await db.executeSql(
        'INSERT INTO workouts (startTime, notes) VALUES (?, ?)',
        [startTime, notes || null]
      );
      
      return result.insertId || 0;
    } catch (error) {
      console.error('Error creating workout:', error);
      throw error;
    }
  },
  
  updateWorkoutEndTime: async (id: number, endTime: string): Promise<void> => {
    try {
      const db = await initDatabase();
      await db.executeSql(
        'UPDATE workouts SET endTime = ? WHERE id = ?',
        [endTime, id]
      );
    } catch (error) {
      console.error(`Error updating workout end time for id ${id}:`, error);
      throw error;
    }
  },
  
  // WorkoutExercise operations
  addExerciseToWorkout: async (workoutId: number, exerciseId: number, orderIndex: number): Promise<number> => {
    try {
      const db = await initDatabase();
      const [result] = await db.executeSql(
        'INSERT INTO workout_exercises (workoutId, exerciseId, order_index) VALUES (?, ?, ?)',
        [workoutId, exerciseId, orderIndex]
      );
      
      return result.insertId || 0;
    } catch (error) {
      console.error('Error adding exercise to workout:', error);
      throw error;
    }
  },
  
  getWorkoutExercises: async (workoutId: number): Promise<any[]> => {
    try {
      const db = await initDatabase();
      const [result] = await db.executeSql(`
        SELECT we.id, we.workoutId, we.exerciseId, we.order_index, e.name, e.category
        FROM workout_exercises we
        JOIN exercises e ON we.exerciseId = e.id
        WHERE we.workoutId = ?
        ORDER BY we.order_index
      `, [workoutId]);
      
      const workoutExercises = [];
      for (let i = 0; i < result.rows.length; i++) {
        workoutExercises.push(result.rows.item(i));
      }
      
      return workoutExercises;
    } catch (error) {
      console.error(`Error getting workout exercises for workout id ${workoutId}:`, error);
      throw error;
    }
  },
  
  // ExerciseSet operations
  addSet: async (workoutExerciseID: number, setNumber: number, weight: number, reps: number): Promise<number> => {
    try {
      const db = await initDatabase();
      const [result] = await db.executeSql(
        'INSERT INTO exercise_sets (workoutExerciseID, setNumber, weight, reps) VALUES (?, ?, ?, ?)',
        [workoutExerciseID, setNumber, weight, reps]
      );
      
      return result.insertId || 0;
    } catch (error) {
      console.error('Error adding exercise set:', error);
      throw error;
    }
  },
  
  getSetsForWorkoutExercise: async (workoutExerciseID: number): Promise<any[]> => {
    try {
      const db = await initDatabase();
      const [result] = await db.executeSql(`
        SELECT * FROM exercise_sets
        WHERE workoutExerciseID = ?
        ORDER BY setNumber
      `, [workoutExerciseID]);
      
      const sets = [];
      for (let i = 0; i < result.rows.length; i++) {
        sets.push(result.rows.item(i));
      }
      
      return sets;
    } catch (error) {
      console.error(`Error getting sets for workout exercise id ${workoutExerciseID}:`, error);
      throw error;
    }
  },
  
  updateSet: async (id: number, weight: number, reps: number): Promise<void> => {
    try {
      const db = await initDatabase();
      await db.executeSql(
        'UPDATE exercise_sets SET weight = ?, reps = ? WHERE id = ?',
        [weight, reps, id]
      );
    } catch (error) {
      console.error(`Error updating set with id ${id}:`, error);
      throw error;
    }
  },
  
  // Get a workout with all its exercises and sets (full data)
  getWorkoutWithDetails: async (workoutId: number): Promise<any> => {
    try {
      const db = await initDatabase();
      
      // Get the workout
      const [workoutResult] = await db.executeSql('SELECT * FROM workouts WHERE id = ?', [workoutId]);
      
      if (workoutResult.rows.length === 0) {
        return null;
      }
      
      const workout = workoutResult.rows.item(0);
      
      // Get the workout exercises
      const workoutExercises = await DatabaseOperations.getWorkoutExercises(workoutId);
      
      // Get sets for each workout exercise
      for (const workoutExercise of workoutExercises) {
        const sets = await DatabaseOperations.getSetsForWorkoutExercise(workoutExercise.id);
        workoutExercise.sets = sets;
      }
      
      workout.exercises = workoutExercises;
      
      return workout;
    } catch (error) {
      console.error(`Error getting workout details for workout id ${workoutId}:`, error);
      throw error;
    }
  }
};