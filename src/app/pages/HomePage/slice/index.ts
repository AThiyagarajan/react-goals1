import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { dashboardSaga } from './saga';
import { DashboardState, GoalStatus, Goal } from './types';

const generateDefaultGoals = () => {
  let defaultGoals: Goal[] = [];
  const today = new Date();
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const todaysDue = today.toISOString().slice(0, -14);
  const yesterdaysDue = yesterday.toISOString().slice(0, -14);

  for (let index = 0; index < 10; index++) {
    defaultGoals.push({
      name: `Default Goal - ${index}`,
      status: index % 2 === 0 ? GoalStatus.CREATED : GoalStatus.INPROGRESS,
      dueDate: index % 2 === 0 ? todaysDue : yesterdaysDue,
    });
  }
  return defaultGoals;
};

export const initialState: DashboardState = {
  goals: generateDefaultGoals(),
};

const slice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    addGoals(state, action: PayloadAction<{ name: string; dueDate: string }>) {
      state.goals = [
        ...state.goals,
        {
          id: `${state.goals.length + 1}`,
          name: action.payload.name,
          status: GoalStatus.CREATED,
          dueDate: action.payload.dueDate,
        },
      ];
    },
    updateGoal(
      state,
      action: PayloadAction<{ goalName: string; status: GoalStatus }>,
    ) {
      state.goals = [
        ...state.goals.map(item => {
          if (item.name === action.payload.goalName) {
            return {
              ...item,
              status: action.payload.status,
            };
          } else {
            return item;
          }
        }),
      ];
    },
  },
});

export const { actions: dashboardActions } = slice;

export const useDashboardSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: dashboardSaga });
  return { actions: slice.actions };
};

/**
 * Example Usage:
 *
 * export function MyComponentNeedingThisSlice() {
 *  const { actions } = useDashboardSlice();
 *
 *  const onButtonClick = (evt) => {
 *    dispatch(actions.someAction());
 *   };
 * }
 */
