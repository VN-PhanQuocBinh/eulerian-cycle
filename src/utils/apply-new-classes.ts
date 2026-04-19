export const applyNewClasses = (prevClasses: string, newClasses: string) => {
  const prevClassList = prevClasses.split(" ").filter(Boolean);
  const newClassList = newClasses.split(" ").filter(Boolean);

  const addedClasses: string[] = [];
  const removedClasses: string[] = [];

  newClassList.forEach((cls) => {
    if (cls.startsWith("-")) {
      removedClasses.push(cls.substring(1));
    } else {
      addedClasses.push(cls);
    }
  });

  const applyedClasses = prevClassList
    .filter((cls) => !removedClasses.includes(cls))
    .concat(addedClasses);

  // console.group("Applying new classes");
  // console.log(`Previous classes: ${prevClasses}`);
  // console.log(`New classes: ${newClasses}`);
  // console.log(`Added classes: ${addedClasses.join(", ")}`);
  // console.log(`Removed classes: ${removedClasses.join(", ")}`);
  // console.log(`Resulting classes: ${applyedClasses.join(", ")}`);
  // console.groupEnd();

  return applyedClasses.join(" ");
};
