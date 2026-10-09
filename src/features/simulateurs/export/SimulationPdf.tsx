// Rendu PDF d'une simulation (maquette « Votre simulation du … »), chargé à la demande.
// react-pdf n'utilise pas le CSS DSFR : couleurs et police reprises des jetons DSFR.

import type { ReactNode } from "react";
import { Document, Font, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import marianneRegular from "@gouvfr/dsfr/dist/fonts/Marianne-Regular.woff?url";
import marianneBold from "@gouvfr/dsfr/dist/fonts/Marianne-Bold.woff?url";
import type { BadgeSpec, LigneBadges } from "../components/resultatBadges";
import type { SimulationExport } from "./simulationExport";

Font.register({
  family: "Marianne",
  fonts: [{ src: marianneRegular }, { src: marianneBold, fontWeight: 700 }],
});
// Pas de césure automatique (libellés réglementaires et badges coupés sinon).
Font.registerHyphenationCallback((mot) => [mot]);

const COULEURS = {
  texte: "#161616",
  bleuFrance: "#000091",
  separateur: "#dddddd",
  success: { fond: "#b8fec9", texte: "#18753c" },
  error: { fond: "#ffe9e9", texte: "#ce0500" },
  info: { fond: "#e8edff", texte: "#0063cb" },
} as const;

const styles = StyleSheet.create({
  page: {
    fontFamily: "Marianne",
    fontSize: 10,
    color: COULEURS.texte,
    paddingVertical: 36,
    paddingHorizontal: 48,
  },
  entete: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  blocMarque: { width: 64 },
  produit: { flexDirection: "row", alignItems: "center", gap: 10 },
  produitNom: { fontSize: 14, fontWeight: 700 },
  produitLogo: { width: 52 },
  titre: { fontSize: 15, fontWeight: 700, marginTop: 20, paddingBottom: 8 },
  separateur: { borderBottomWidth: 1, borderBottomColor: COULEURS.separateur },
  sectionTitre: { fontSize: 11, fontWeight: 700, marginTop: 12, marginBottom: 5 },
  ligne: { marginBottom: 4 },
  resultatsEntete: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 22,
    paddingBottom: 6,
    borderBottomWidth: 2,
    borderBottomColor: COULEURS.bleuFrance,
  },
  resultatsTitre: { fontSize: 16, fontWeight: 700, color: COULEURS.bleuFrance },
  miseAJour: { fontSize: 10, color: COULEURS.bleuFrance },
  bloc: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COULEURS.separateur,
  },
  blocTitre: { fontSize: 11, fontWeight: 700, color: COULEURS.bleuFrance, marginBottom: 6 },
  rangee: { flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: 8 },
  pays: { marginRight: 2 },
  badge: {
    fontSize: 8.5,
    fontWeight: 700,
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 3,
  },
  marque: { width: 52, marginRight: 8 },
  derogation: { fontSize: 8, marginTop: 12, lineHeight: 1.4 },
  invitation: { fontSize: 11, fontWeight: 700, marginTop: 12 },
});

type Props = {
  modele: SimulationExport;
  // Origine absolue du site : react-pdf charge les images par URL.
  origine: string;
};

export function SimulationPdf({ modele, origine }: Props) {
  const details = modele.resultats.details;
  return (
    <Document title={modele.titre} author="Odicé" language="fr">
      <Page size="A4" style={styles.page}>
        <View style={styles.entete}>
          <Image src={`${origine}/images/pdf/bloc-marque.png`} style={styles.blocMarque} />
          <View style={styles.produit}>
            <Text style={styles.produitNom}>Odicé</Text>
            <Image src={`${origine}/logo/logo.png`} style={styles.produitLogo} />
          </View>
        </View>

        <Text style={[styles.titre, styles.separateur]}>{modele.titre}</Text>

        {modele.saisies.map((section) => (
          <View key={section.titre} wrap={false}>
            <Text style={styles.sectionTitre}>{section.titre}</Text>
            {section.lignes.map((ligne) => (
              <Text key={ligne.libelle} style={styles.ligne}>
                {ligne.libelle} : {ligne.valeur}
              </Text>
            ))}
          </View>
        ))}

        <View style={styles.resultatsEntete} wrap={false}>
          <Text style={styles.resultatsTitre}>Conditions de mouvement des viandes</Text>
          <Text style={styles.miseAJour}>Dernière mise à jour : {modele.dateMiseAJour}</Text>
        </View>

        <Bloc titre="Possibilité de mouvement">
          <Lignes ligne={modele.resultats.mouvement} />
        </Bloc>

        {details !== null && (
          <>
            <Bloc titre="Marque à apposer sur les viandes">
              <View style={styles.rangee}>
                {details.marque !== null && (
                  <Image
                    src={`${origine}/images/marques/${details.marque}.png`}
                    style={styles.marque}
                  />
                )}
                {details.marqueBadge !== null && <Badge badge={details.marqueBadge} />}
              </View>
            </Bloc>
            <Bloc titre="Traitement d'atténuation selon la destination des viandes">
              <Lignes ligne={details.traitement} />
            </Bloc>
            <Bloc titre="Document d'accompagnement">
              <Lignes ligne={details.document} />
            </Bloc>
          </>
        )}

        <Text style={styles.derogation}>{modele.derogation}</Text>
        <Text style={styles.invitation}>
          Réalisez une nouvelle simulation sur {origine.replace(/^https?:\/\//, "")}
        </Text>
      </Page>
    </Document>
  );
}

function Bloc({ titre, children }: { titre: string; children: ReactNode }) {
  return (
    <View style={styles.bloc} wrap={false}>
      <Text style={styles.blocTitre}>{titre}</Text>
      {children}
    </View>
  );
}

function Lignes({ ligne }: { ligne: LigneBadges }) {
  return (
    <View style={styles.rangee}>
      {ligne.france !== null && (
        <>
          <Text style={styles.pays}>France</Text>
          <Badge badge={ligne.france} />
        </>
      )}
      {ligne.ue !== null && (
        <>
          <Text style={[styles.pays, { marginLeft: 16 }]}>UE</Text>
          <Badge badge={ligne.ue} />
        </>
      )}
    </View>
  );
}

function Badge({ badge }: { badge: BadgeSpec }) {
  const couleur = COULEURS[badge.variant];
  return (
    <Text style={[styles.badge, { backgroundColor: couleur.fond, color: couleur.texte }]}>
      {badge.label}
    </Text>
  );
}
