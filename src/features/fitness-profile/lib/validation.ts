export type FitnessFormErrors = Partial<
  Record<"name" | "age" | "height" | "weight", string>
>;

type FitnessFormValues = {
  name: string;
  age: string;
  height: string;
  weight: string;
};

export function validateFitnessProfile(
  values: FitnessFormValues,
): FitnessFormErrors {
  const errors: FitnessFormErrors = {};

  if (!values.name.trim()) {
    errors.name = "Enter your name.";
  }

  const ageNumber = Number(values.age);

  if (
    !values.age.trim() ||
    !Number.isInteger(ageNumber) ||
    ageNumber < 1 ||
    ageNumber > 120
  ) {
    errors.age = "Enter a valid age between 1 and 120.";
  }

  const heightNumber = Number(values.height);

  if (
    !values.height.trim() ||
    !Number.isFinite(heightNumber) ||
    heightNumber < 80 ||
    heightNumber > 250
  ) {
    errors.height = "Enter a valid height between 80 and 250 cm.";
  }

  const weightNumber = Number(values.weight);

  if (
    !values.weight.trim() ||
    !Number.isFinite(weightNumber) ||
    weightNumber < 20 ||
    weightNumber > 350
  ) {
    errors.weight = "Enter a valid weight between 20 and 350 kg.";
  }

  return errors;
}
