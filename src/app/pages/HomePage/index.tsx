import { GoalStats } from 'app/components/GoalStats';
import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useDashboardSlice } from './slice';
import { selectGoals } from './slice/selectors';
import { Goal, GoalStatus } from './slice/types';

export function HomePage() {
  const inputGoalRef = React.useRef<HTMLInputElement>(null);
  const inputGoalDueDateRef = React.useRef<HTMLInputElement>(null);
  const { actions } = useDashboardSlice();

  const dispatch = useDispatch();

  const goals = useSelector(selectGoals);

  const onButtonClick = () => {
    if (inputGoalRef.current?.value && inputGoalDueDateRef.current?.value) {
      dispatch(
        actions.addGoals({
          name: inputGoalRef.current?.value,
          dueDate: inputGoalDueDateRef.current?.value,
        }),
      );
      inputGoalRef.current.value = '';
    }
  };

  const getStatusClassName = (status: GoalStatus) => {
    if (status === GoalStatus.CREATED) {
      return 'goal-created';
    }
    if (status === GoalStatus.INPROGRESS) {
      return 'goal-inprogress';
    }
    if (status === GoalStatus.COMPLETED) {
      return 'goal-completed';
    }
  };

  const getButtonLabel = (status: GoalStatus) => {
    if (status === GoalStatus.CREATED) {
      return 'Start Goal';
    }
    if (status === GoalStatus.INPROGRESS) {
      return 'Mark Completed';
    }
  };

  const onUpdateGoal = (goal: Goal) => () => {
    if (goal.status === GoalStatus.CREATED) {
      dispatch(
        actions.updateGoal({
          goalName: goal.name,
          status: GoalStatus.INPROGRESS,
        }),
      );
    }
    if (goal.status === GoalStatus.INPROGRESS) {
      dispatch(
        actions.updateGoal({
          goalName: goal.name,
          status: GoalStatus.COMPLETED,
        }),
      );
    }
  };

  const getOverdueStatus = (dateString: string) => {
    const today = new Date().toISOString().slice(0, -14);
    if (new Date(dateString).getTime() < new Date(today).getTime()) {
      return 'Overdue';
    } else {
      return 'On Track';
    }
  };

  const getOverdueStatusClass = (dateString: string) => {
    const today = new Date().toISOString().slice(0, -14);
    if (new Date(dateString).getTime() < new Date(today).getTime()) {
      return 'overdue';
    } else {
      return 'on-track';
    }
  };

  return (
    <Wrapper>
      <Helmet>
        <title>HomePage</title>
        <meta name="description" content="Goals Home Page" />
      </Helmet>
      <div className="add-goal-form-container">
        <label htmlFor="goal-add">Name of the Goal:</label>
        <input id="goal-add" ref={inputGoalRef} type="text" />
        <label htmlFor="goal-due-date">Due Date:</label>
        <input id="goal-due-date" ref={inputGoalDueDateRef} type="date" />
        <button onClick={onButtonClick}>Add Goals</button>
      </div>
      <div className="goal-rows-container">
        {goals.length === 0 && (
          <div className="no-goals-indicator">
            No Goals present! Starting adding new goals
          </div>
        )}
        {goals.length > 0 &&
          goals.map((goal, index) => (
            <div className="goal-row" key={`goal-${index}`}>
              <span className="goal-name">{goal.name}</span>
              <span className="goal-due-date">{goal.dueDate}</span>
              <span
                className={`goal-due-date-status ${getOverdueStatusClass(
                  goal.dueDate,
                )}`}
              >
                {getOverdueStatus(goal.dueDate)}
              </span>
              <span
                className={`goal-status ${getStatusClassName(goal.status)}`}
              >
                {goal.status}
              </span>
              {goal.status !== GoalStatus.COMPLETED && (
                <button
                  className="goal-update-button"
                  onClick={onUpdateGoal(goal)}
                >
                  {getButtonLabel(goal.status)}
                </button>
              )}
            </div>
          ))}
      </div>
      <Link to="/stats">View Stats</Link>
      <GoalStats />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  padding: 10px;
  width: 60%;
  margin-left: auto;
  margin-right: auto;
  border-left: black solid 1px;
  border-right: black solid 1px;
  height: 100%;
  overflow-y: auto;

  .add-goal-form-container {
    display: flex;
    justify-content: center;
    gap: 10px;
  }
  .goal-rows-container {
    margin: 20px;
    display: flex;
    flex-direction: column;
    border-top: 1px solid black;
  }
  .goal-row {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
    column-gap: 10px;
    grid-template-rows: auto;
    padding: 10px 0;
    border-bottom: 1px solid black;

    .goal-due-date-status {
      font-weight: 500;

      &.overdue {
        color: red;
      }

      &.on-track {
        color: darkgreen;
      }
    }

    .goal-status {
      text-align: center;
      padding: 4px;
      border-radius: 4px;
      &.goal-completed {
        background: #00c49f;
        color: white;
      }
      &.goal-inprogress {
        background: #ffbb28;
        color: white;
      }
      &.goal-created {
        background: #0088fe;
        color: white;
      }
    }

    .goal-update-button {
      padding: 4px;
    }
  }
`;
