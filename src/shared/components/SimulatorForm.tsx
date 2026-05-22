import type { ReactNode } from "react";

type SimulatorFormProps = {
  title: string;
  onSubmit: (data: Record<string, string>) => void;
  children?: ReactNode;
};

export function SimulatorForm({ title, children }: SimulatorFormProps) {
  // TODO: implémenter le formulaire dynamique pilote par les types du moteur
  return (
    <section className="fr-form">
      <h2>{title}</h2>
      {children}
    </section>
  );
}
