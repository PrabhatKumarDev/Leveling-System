export const canChooseJob = (user) => {
  return user.level >= 25 && !user.hasChosenJob;
};