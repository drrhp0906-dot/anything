import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ============================================
// SUBJECT DATA STRUCTURE
// Based on Standard Medical Textbooks
// ============================================

const subjectData = {
  // PATHOLOGY - Based on Robbins Pathology
  Pathology: {
    description: "Study of disease processes, their causes, and effects on the body",
    systems: [
      {
        name: "General Pathology",
        description: "Basic pathological processes applicable to all organs",
        marks: [
          { value: 10, description: "Long Essay Questions" },
          { value: 5, description: "Short Essay Questions" },
          { value: 2, description: "Short Answer Questions" }
        ]
      },
      {
        name: "Hematology",
        description: "Diseases of blood and blood-forming organs",
        marks: [
          { value: 10, description: "Long Essay Questions" },
          { value: 5, description: "Short Essay Questions" },
          { value: 2, description: "Short Answer Questions" }
        ]
      },
      {
        name: "Cardiovascular System",
        description: "Pathology of heart and blood vessels",
        marks: [
          { value: 10, description: "Long Essay Questions" },
          { value: 5, description: "Short Essay Questions" },
          { value: 2, description: "Short Answer Questions" }
        ]
      },
      {
        name: "Respiratory System",
        description: "Pathology of lungs and airways",
        marks: [
          { value: 10, description: "Long Essay Questions" },
          { value: 5, description: "Short Essay Questions" },
          { value: 2, description: "Short Answer Questions" }
        ]
      },
      {
        name: "Gastrointestinal System",
        description: "Pathology of digestive tract, liver, and pancreas",
        marks: [
          { value: 10, description: "Long Essay Questions" },
          { value: 5, description: "Short Essay Questions" },
          { value: 2, description: "Short Answer Questions" }
        ]
      },
      {
        name: "Renal System",
        description: "Pathology of kidneys and urinary tract",
        marks: [
          { value: 10, description: "Long Essay Questions" },
          { value: 5, description: "Short Essay Questions" },
          { value: 2, description: "Short Answer Questions" }
        ]
      },
      {
        name: "Endocrine System",
        description: "Pathology of endocrine glands",
        marks: [
          { value: 10, description: "Long Essay Questions" },
          { value: 5, description: "Short Essay Questions" },
          { value: 2, description: "Short Answer Questions" }
        ]
      },
      {
        name: "Reproductive System",
        description: "Pathology of male and female reproductive organs",
        marks: [
          { value: 10, description: "Long Essay Questions" },
          { value: 5, description: "Short Essay Questions" },
          { value: 2, description: "Short Answer Questions" }
        ]
      },
      {
        name: "Musculoskeletal System",
        description: "Pathology of bones, joints, and soft tissues",
        marks: [
          { value: 10, description: "Long Essay Questions" },
          { value: 5, description: "Short Essay Questions" },
          { value: 2, description: "Short Answer Questions" }
        ]
      },
      {
        name: "Nervous System",
        description: "Pathology of brain, spinal cord, and peripheral nerves",
        marks: [
          { value: 10, description: "Long Essay Questions" },
          { value: 5, description: "Short Essay Questions" },
          { value: 2, description: "Short Answer Questions" }
        ]
      }
    ]
  },

  // PHARMACOLOGY - Based on KD Tripathi
  Pharmacology: {
    description: "Study of drugs, their actions, uses, and adverse effects",
    systems: [
      {
        name: "General Pharmacology",
        description: "Basic pharmacological principles, pharmacokinetics, and pharmacodynamics",
        marks: [
          { value: 10, description: "Long Essay Questions" },
          { value: 5, description: "Short Essay Questions" },
          { value: 2, description: "Short Answer Questions" }
        ]
      },
      {
        name: "Autonomic Nervous System",
        description: "Drugs acting on sympathetic and parasympathetic systems",
        marks: [
          { value: 10, description: "Long Essay Questions" },
          { value: 5, description: "Short Essay Questions" },
          { value: 2, description: "Short Answer Questions" }
        ]
      },
      {
        name: "Cardiovascular Drugs",
        description: "Antihypertensives, antianginals, antiarrhythmics, and heart failure drugs",
        marks: [
          { value: 10, description: "Long Essay Questions" },
          { value: 5, description: "Short Essay Questions" },
          { value: 2, description: "Short Answer Questions" }
        ]
      },
      {
        name: "Respiratory Drugs",
        description: "Bronchodilators, antitussives, and anti-asthma drugs",
        marks: [
          { value: 10, description: "Long Essay Questions" },
          { value: 5, description: "Short Essay Questions" },
          { value: 2, description: "Short Answer Questions" }
        ]
      },
      {
        name: "Gastrointestinal Drugs",
        description: "Antacids, anti-ulcer drugs, laxatives, and antiemetics",
        marks: [
          { value: 10, description: "Long Essay Questions" },
          { value: 5, description: "Short Essay Questions" },
          { value: 2, description: "Short Answer Questions" }
        ]
      },
      {
        name: "Antimicrobials",
        description: "Antibiotics, antivirals, antifungals, and antiparasitics",
        marks: [
          { value: 10, description: "Long Essay Questions" },
          { value: 5, description: "Short Essay Questions" },
          { value: 2, description: "Short Answer Questions" }
        ]
      },
      {
        name: "Central Nervous System Drugs",
        description: "Sedatives, hypnotics, antiepileptics, and antidepressants",
        marks: [
          { value: 10, description: "Long Essay Questions" },
          { value: 5, description: "Short Essay Questions" },
          { value: 2, description: "Short Answer Questions" }
        ]
      },
      {
        name: "Endocrine Drugs",
        description: "Insulin, oral hypoglycemics, thyroid drugs, and corticosteroids",
        marks: [
          { value: 10, description: "Long Essay Questions" },
          { value: 5, description: "Short Essay Questions" },
          { value: 2, description: "Short Answer Questions" }
        ]
      },
      {
        name: "Chemotherapy",
        description: "Anticancer drugs and immunosuppressants",
        marks: [
          { value: 10, description: "Long Essay Questions" },
          { value: 5, description: "Short Essay Questions" },
          { value: 2, description: "Short Answer Questions" }
        ]
      },
      {
        name: "Autacoids and Related Drugs",
        description: "Antihistamines, NSAIDs, and prostaglandin analogues",
        marks: [
          { value: 10, description: "Long Essay Questions" },
          { value: 5, description: "Short Essay Questions" },
          { value: 2, description: "Short Answer Questions" }
        ]
      }
    ]
  },

  // MICROBIOLOGY - Based on Ananthanarayan
  Microbiology: {
    description: "Study of microorganisms causing human diseases",
    systems: [
      {
        name: "General Microbiology",
        description: "Basic concepts, sterilization, disinfection, and culture media",
        marks: [
          { value: 10, description: "Long Essay Questions" },
          { value: 5, description: "Short Essay Questions" },
          { value: 2, description: "Short Answer Questions" }
        ]
      },
      {
        name: "Immunology",
        description: "Immune system, antigens, antibodies, and immunological tests",
        marks: [
          { value: 10, description: "Long Essay Questions" },
          { value: 5, description: "Short Essay Questions" },
          { value: 2, description: "Short Answer Questions" }
        ]
      },
      {
        name: "Bacteriology - Gram Positive Cocci",
        description: "Staphylococcus, Streptococcus, and Pneumococcus",
        marks: [
          { value: 10, description: "Long Essay Questions" },
          { value: 5, description: "Short Essay Questions" },
          { value: 2, description: "Short Answer Questions" }
        ]
      },
      {
        name: "Bacteriology - Gram Negative Bacilli",
        description: "Enterobacteriaceae, Pseudomonas, and Vibrio",
        marks: [
          { value: 10, description: "Long Essay Questions" },
          { value: 5, description: "Short Essay Questions" },
          { value: 2, description: "Short Answer Questions" }
        ]
      },
      {
        name: "Mycobacteriology",
        description: "Tuberculosis, Leprosy, and atypical mycobacteria",
        marks: [
          { value: 10, description: "Long Essay Questions" },
          { value: 5, description: "Short Essay Questions" },
          { value: 2, description: "Short Answer Questions" }
        ]
      },
      {
        name: "Virology",
        description: "DNA and RNA viruses causing human diseases",
        marks: [
          { value: 10, description: "Long Essay Questions" },
          { value: 5, description: "Short Essay Questions" },
          { value: 2, description: "Short Answer Questions" }
        ]
      },
      {
        name: "Mycology",
        description: "Fungal infections - superficial, cutaneous, and systemic",
        marks: [
          { value: 10, description: "Long Essay Questions" },
          { value: 5, description: "Short Essay Questions" },
          { value: 2, description: "Short Answer Questions" }
        ]
      },
      {
        name: "Parasitology",
        description: "Protozoa and helminths causing human diseases",
        marks: [
          { value: 10, description: "Long Essay Questions" },
          { value: 5, description: "Short Essay Questions" },
          { value: 2, description: "Short Answer Questions" }
        ]
      },
      {
        name: "Clinical Microbiology",
        description: "Specimen collection, laboratory diagnosis, and antimicrobial sensitivity",
        marks: [
          { value: 10, description: "Long Essay Questions" },
          { value: 5, description: "Short Essay Questions" },
          { value: 2, description: "Short Answer Questions" }
        ]
      }
    ]
  }
};

// ============================================
// QUESTIONS DATA
// Real questions from MBBS curriculum
// ============================================

const questionsData: Record<string, Record<string, Record<number, Array<{title: string, content?: string, years?: string[]}>>>> = {
  "Pathology": {
    "General Pathology": {
      10: [
        { title: "Define and classify necrosis. Describe the morphological features of different types of necrosis with examples.", years: ["2019", "2021", "2023"] },
        { title: "Define and classify inflammation. Describe the vascular and cellular events in acute inflammation.", years: ["2018", "2020", "2022"] },
        { title: "Define neoplasia. Classify tumors. Describe the differences between benign and malignant tumors.", years: ["2017", "2019", "2021", "2023"] },
        { title: "Define and classify anemia. Describe the pathogenesis and pathology of megaloblastic anemia.", years: ["2018", "2020", "2022"] },
        { title: "Define and classify shock. Describe the pathogenesis and pathological changes in different types of shock.", years: ["2019", "2021", "2023"] },
        { title: "Define and classify edema. Describe the pathogenesis of different types of edema.", years: ["2017", "2020", "2022"] },
        { title: "Define and classify thrombosis. Describe the pathogenesis and fate of thrombus.", years: ["2018", "2021", "2023"] },
        { title: "Define and classify embolism. Describe the types, pathogenesis and effects of embolism.", years: ["2019", "2022"] },
        { title: "Define and classify infarction. Describe the morphological features of infarcts in different organs.", years: ["2017", "2020", "2023"] },
        { title: "Define and classify cell injury. Describe the morphological changes in reversible and irreversible cell injury.", years: ["2018", "2021"] }
      ],
      5: [
        { title: "Define apoptosis. Describe the morphological features and mechanism of apoptosis.", years: ["2019", "2021", "2023"] },
        { title: "Define gangrene. Describe the types and morphology of gangrene.", years: ["2018", "2020", "2022"] },
        { title: "Define granuloma. Describe the pathogenesis and types of granulomatous inflammation.", years: ["2019", "2021", "2023"] },
        { title: "Write short notes on: Metaplasia", years: ["2017", "2019", "2022"] },
        { title: "Write short notes on: Dysplasia", years: ["2018", "2020", "2023"] },
        { title: "Define and classify abscess. Describe the morphology of abscess.", years: ["2019", "2021"] },
        { title: "Write short notes on: Healing by first intention", years: ["2017", "2020", "2022"] },
        { title: "Write short notes on: Healing by second intention", years: ["2018", "2021", "2023"] },
        { title: "Define and classify pigment. Describe the morphology of melanin pigmentation.", years: ["2019", "2022"] },
        { title: "Write short notes on: Calcification - Dystrophic and Metastatic", years: ["2020", "2021", "2023"] },
        { title: "Define amyloidosis. Describe the morphology and diagnosis of amyloidosis.", years: ["2018", "2021"] },
        { title: "Write short notes on: Free radicals and oxidative stress", years: ["2019", "2022"] },
        { title: "Define and classify hemorrhage. Describe the types and effects of hemorrhage.", years: ["2017", "2020", "2023"] },
        { title: "Write short notes on: Carcinogenesis and oncogenes", years: ["2018", "2021", "2023"] },
        { title: "Define and classify anemia. Describe the morphology of iron deficiency anemia.", years: ["2019", "2022"] }
      ],
      2: [
        { title: "Define: Atrophy", years: ["2019", "2021", "2023"] },
        { title: "Define: Hypertrophy", years: ["2018", "2020", "2022"] },
        { title: "Define: Hyperplasia", years: ["2019", "2021", "2023"] },
        { title: "Differences between: Hypertrophy and Hyperplasia", years: ["2017", "2020"] },
        { title: "Define: Ischemia", years: ["2018", "2022"] },
        { title: "Define: Hypoxia", years: ["2019", "2021", "2023"] },
        { title: "Define: Pyknosis, Karyorrhexis, Karyolysis", years: ["2017", "2020", "2022"] },
        { title: "Define: Fibrinoid necrosis", years: ["2018", "2021"] },
        { title: "Define: Caseous necrosis", years: ["2019", "2022", "2023"] },
        { title: "Define: Fat necrosis", years: ["2020", "2021"] },
        { title: "Differences between: Apoptosis and Necrosis", years: ["2017", "2019", "2023"] },
        { title: "Define: Chemotaxis", years: ["2018", "2021"] },
        { title: "Define: Opsonization", years: ["2019", "2022"] },
        { title: "Define: Phagocytosis", years: ["2020", "2023"] },
        { title: "Define: Exudate vs Transudate", years: ["2017", "2021", "2023"] },
        { title: "Define: Granulation tissue", years: ["2018", "2020", "2022"] },
        { title: "Define: Pus cells", years: ["2019", "2021"] },
        { title: "Define: Virchow's triad", years: ["2017", "2022", "2023"] },
        { title: "Define: Oncogenes", years: ["2018", "2021"] },
        { title: "Define: Tumor suppressor genes", years: ["2019", "2022"] }
      ]
    },
    "Hematology": {
      10: [
        { title: "Define and classify anemia. Describe the etiology, pathogenesis, and pathology of megaloblastic anemia.", years: ["2018", "2020", "2022"] },
        { title: "Define and classify leukemia. Describe the pathology and laboratory diagnosis of acute myeloid leukemia.", years: ["2019", "2021", "2023"] },
        { title: "Define and classify lymphoma. Describe the pathology and classification of Hodgkin's lymphoma.", years: ["2017", "2020", "2022"] },
        { title: "Define and classify bleeding disorders. Describe the pathogenesis and laboratory diagnosis of hemophilia.", years: ["2018", "2021", "2023"] },
        { title: "Define and classify thalassemia. Describe the pathogenesis and pathology of beta-thalassemia major.", years: ["2019", "2022"] }
      ],
      5: [
        { title: "Write short notes on: Iron deficiency anemia - morphology and diagnosis", years: ["2019", "2021", "2023"] },
        { title: "Write short notes on: Sickle cell anemia - pathogenesis and morphology", years: ["2018", "2020", "2022"] },
        { title: "Write short notes on: Aplastic anemia - etiology and pathology", years: ["2017", "2021"] },
        { title: "Write short notes on: Chronic myeloid leukemia - pathology and diagnosis", years: ["2019", "2022", "2023"] },
        { title: "Write short notes on: Multiple myeloma - pathology and diagnosis", years: ["2018", "2021"] },
        { title: "Write short notes on: Non-Hodgkin's lymphoma - classification and morphology", years: ["2020", "2022"] },
        { title: "Write short notes on: Hemophilia - types and laboratory findings", years: ["2017", "2021", "2023"] },
        { title: "Write short notes on: Disseminated intravascular coagulation", years: ["2019", "2022"] },
        { title: "Write short notes on: Pernicious anemia", years: ["2018", "2020"] },
        { title: "Write short notes on: Polycythemia vera", years: ["2021", "2023"] }
      ],
      2: [
        { title: "Define: Anisocytosis", years: ["2019", "2021"] },
        { title: "Define: Poikilocytosis", years: ["2018", "2022"] },
        { title: "Define: Reticulocyte count", years: ["2017", "2020", "2023"] },
        { title: "Define: Pancytopenia", years: ["2019", "2021"] },
        { title: "Define: Leukemoid reaction", years: ["2018", "2022", "2023"] },
        { title: "Define: Reed-Sternberg cells", years: ["2020", "2021"] },
        { title: "Define: Philadelphia chromosome", years: ["2017", "2022"] },
        { title: "Define: Heinz bodies", years: ["2019", "2023"] },
        { title: "Define: Howell-Jolly bodies", years: ["2018", "2021"] },
        { title: "Define: Schistocytes", years: ["2020", "2022"] }
      ]
    },
    "Cardiovascular System": {
      10: [
        { title: "Define and classify atherosclerosis. Describe the pathogenesis and complications of atherosclerosis.", years: ["2017", "2019", "2021", "2023"] },
        { title: "Define and classify myocardial infarction. Describe the pathogenesis, pathology, and complications of MI.", years: ["2018", "2020", "2022"] },
        { title: "Define and classify hypertension. Describe the pathology of essential hypertension and its effects on various organs.", years: ["2019", "2021", "2023"] },
        { title: "Define and classify rheumatic fever. Describe the etiology, pathogenesis, and pathology of rheumatic heart disease.", years: ["2017", "2020", "2022"] },
        { title: "Define and classify cardiomyopathy. Describe the pathology of dilated and hypertrophic cardiomyopathy.", years: ["2018", "2021", "2023"] }
      ],
      5: [
        { title: "Write short notes on: Ischemic heart disease", years: ["2019", "2021", "2023"] },
        { title: "Write short notes on: Angina pectoris - types and pathogenesis", years: ["2018", "2020", "2022"] },
        { title: "Write short notes on: Infective endocarditis - etiology and pathology", years: ["2017", "2021", "2023"] },
        { title: "Write short notes on: Pericarditis - types and morphology", years: ["2019", "2022"] },
        { title: "Write short notes on: Aortic aneurysm - types and complications", years: ["2018", "2020", "2023"] },
        { title: "Write short notes on: Congenital heart diseases - VSD, ASD, PDA", years: ["2021", "2022"] },
        { title: "Write short notes on: Heart failure - pathogenesis and morphology", years: ["2017", "2020", "2023"] },
        { title: "Write short notes on: Myocarditis - etiology and pathology", years: ["2019", "2022"] }
      ],
      2: [
        { title: "Define: Atheroma", years: ["2019", "2021", "2023"] },
        { title: "Define: Fatty streak", years: ["2018", "2020"] },
        { title: "Define: Coronary artery disease", years: ["2017", "2022", "2023"] },
        { title: "Define: cardiac enzymes in MI", years: ["2019", "2021"] },
        { title: "Define: Aschoff bodies", years: ["2018", "2020", "2022"] },
        { title: "Define: Vegetations in endocarditis", years: ["2017", "2021", "2023"] },
        { title: "Define: Cor pulmonale", years: ["2019", "2022"] },
        { title: "Define: Aneurysm", years: ["2020", "2023"] }
      ]
    },
    "Respiratory System": {
      10: [
        { title: "Define and classify pneumonia. Describe the pathology of lobar pneumonia and bronchopneumonia.", years: ["2017", "2019", "2021", "2023"] },
        { title: "Define and classify bronchogenic carcinoma. Describe the pathology and staging of lung cancer.", years: ["2018", "2020", "2022"] },
        { title: "Define and classify chronic obstructive pulmonary disease. Describe the pathology of emphysema and chronic bronchitis.", years: ["2019", "2021", "2023"] },
        { title: "Define and classify tuberculosis. Describe the primary and secondary pulmonary tuberculosis with their morphology.", years: ["2017", "2020", "2022", "2023"] },
        { title: "Define and classify bronchial asthma. Describe the pathogenesis and pathology of bronchial asthma.", years: ["2018", "2021", "2023"] }
      ],
      5: [
        { title: "Write short notes on: Emphysema - types and morphology", years: ["2019", "2021", "2023"] },
        { title: "Write short notes on: Bronchiectasis - pathogenesis and pathology", years: ["2018", "2020", "2022"] },
        { title: "Write short notes on: Pulmonary embolism - pathogenesis and effects", years: ["2017", "2021"] },
        { title: "Write short notes on: Pleural effusion and empyema", years: ["2019", "2022", "2023"] },
        { title: "Write short notes on: Pneumoconiosis - silicosis and asbestosis", years: ["2018", "2021"] },
        { title: "Write short notes on: Atelectasis - types and causes", years: ["2020", "2022"] },
        { title: "Write short notes on: Lung abscess - causes and morphology", years: ["2017", "2021", "2023"] },
        { title: "Write short notes on: Sarcoidosis - pathology and diagnosis", years: ["2019", "2022"] }
      ],
      2: [
        { title: "Define: Ghon focus", years: ["2019", "2021", "2023"] },
        { title: "Define: Ghon complex", years: ["2018", "2020", "2022"] },
        { title: "Define: Caseation necrosis in TB", years: ["2017", "2021", "2023"] },
        { title: "Define: Panacinar emphysema", years: ["2019", "2022"] },
        { title: "Define: Centriacinar emphysema", years: ["2018", "2020"] },
        { title: "Define: Cor pulmonale", years: ["2021", "2023"] },
        { title: "Define: Barrel chest", years: ["2017", "2022"] },
        { title: "Define: Cyanosis", years: ["2019", "2021"] }
      ]
    },
    "Gastrointestinal System": {
      10: [
        { title: "Define and classify peptic ulcer. Describe the etiology, pathogenesis, and complications of peptic ulcer.", years: ["2018", "2020", "2022"] },
        { title: "Define and classify cirrhosis. Describe the pathology and complications of liver cirrhosis.", years: ["2017", "2019", "2021", "2023"] },
        { title: "Define and classify carcinoma stomach. Describe the pathology and staging of gastric carcinoma.", years: ["2018", "2021", "2023"] },
        { title: "Define and classify hepatitis. Describe the pathology of viral hepatitis with its morphological features.", years: ["2019", "2020", "2022"] },
        { title: "Define and classify pancreatic carcinoma. Describe the pathology and diagnosis of carcinoma pancreas.", years: ["2017", "2021"] }
      ],
      5: [
        { title: "Write short notes on: Appendicitis - pathogenesis and pathology", years: ["2019", "2021", "2023"] },
        { title: "Write short notes on: Ulcerative colitis - pathology and complications", years: ["2018", "2020", "2022"] },
        { title: "Write short notes on: Crohn's disease - pathology and complications", years: ["2017", "2021"] },
        { title: "Write short notes on: Carcinoma colon - pathology and staging", years: ["2019", "2022", "2023"] },
        { title: "Write short notes on: Alcoholic liver disease - pathogenesis and pathology", years: ["2018", "2021"] },
        { title: "Write short notes on: Hepatocellular carcinoma - pathology and diagnosis", years: ["2020", "2022"] },
        { title: "Write short notes on: Gallstones - types and complications", years: ["2017", "2021", "2023"] },
        { title: "Write short notes on: Acute pancreatitis - pathogenesis and pathology", years: ["2019", "2022"] }
      ],
      2: [
        { title: "Define: Virchow's node", years: ["2019", "2021", "2023"] },
        { title: "Define: Barrett's esophagus", years: ["2018", "2020", "2022"] },
        { title: "Define: Alpha-fetoprotein", years: ["2017", "2021"] },
        { title: "Define: Ascites in cirrhosis", years: ["2019", "2022", "2023"] },
        { title: "Define: Caput medusae", years: ["2018", "2021"] },
        { title: "Define: Pseudomyxoma peritonei", years: ["2020", "2023"] },
        { title: "Define: CEA (Carcinoembryonic antigen)", years: ["2017", "2022"] },
        { title: "Define: Serum amylase", years: ["2019", "2021"] }
      ]
    },
    "Renal System": {
      10: [
        { title: "Define and classify glomerulonephritis. Describe the pathology of acute post-streptococcal glomerulonephritis.", years: ["2017", "2019", "2021", "2023"] },
        { title: "Define and classify nephrotic syndrome. Describe the pathology and clinical features of nephrotic syndrome.", years: ["2018", "2020", "2022"] },
        { title: "Define and classify acute kidney injury. Describe the pathology of acute tubular necrosis.", years: ["2019", "2021", "2023"] },
        { title: "Define and classify chronic kidney disease. Describe the pathology of chronic pyelonephritis.", years: ["2017", "2020", "2022"] },
        { title: "Define and classify renal cell carcinoma. Describe the pathology and staging of renal cell carcinoma.", years: ["2018", "2021", "2023"] }
      ],
      5: [
        { title: "Write short notes on: Rapidly progressive glomerulonephritis", years: ["2019", "2021", "2023"] },
        { title: "Write short notes on: Minimal change disease", years: ["2018", "2020", "2022"] },
        { title: "Write short notes on: Membranous glomerulopathy", years: ["2017", "2021"] },
        { title: "Write short notes on: IgA nephropathy", years: ["2019", "2022", "2023"] },
        { title: "Write short notes on: Urinary tract infection - pathogenesis and pathology", years: ["2018", "2021"] },
        { title: "Write short notes on: Renal stones - types and complications", years: ["2020", "2022"] },
        { title: "Write short notes on: Wilms tumor - pathology and prognosis", years: ["2017", "2021", "2023"] },
        { title: "Write short notes on: Hydronephrosis - causes and pathology", years: ["2019", "2022"] }
      ],
      2: [
        { title: "Define: Crescent formation in GN", years: ["2019", "2021", "2023"] },
        { title: "Define: Nephritic syndrome", years: ["2018", "2020", "2022"] },
        { title: "Define: Proteinuria", years: ["2017", "2021", "2023"] },
        { title: "Define: Hematuria", years: ["2019", "2022"] },
        { title: "Define: Casts in urine", years: ["2018", "2021"] },
        { title: "Define: Kimmelstiel-Wilson nodules", years: ["2020", "2022", "2023"] },
        { title: "Define: Uremia", years: ["2017", "2021"] },
        { title: "Define: Dialysis", years: ["2019", "2023"] }
      ]
    },
    "Endocrine System": {
      10: [
        { title: "Define and classify goiter. Describe the pathology of diffuse and nodular goiter.", years: ["2018", "2020", "2022"] },
        { title: "Define and classify thyroid tumors. Describe the pathology of papillary carcinoma thyroid.", years: ["2017", "2019", "2021", "2023"] },
        { title: "Define and classify diabetes mellitus. Describe the pathology and complications of diabetes mellitus.", years: ["2018", "2021", "2023"] },
        { title: "Define and classify pituitary tumors. Describe the pathology of pituitary adenoma.", years: ["2019", "2022"] },
        { title: "Define and classify adrenal tumors. Describe the pathology of pheochromocytoma.", years: ["2017", "2020", "2022"] }
      ],
      5: [
        { title: "Write short notes on: Thyrotoxicosis - pathology and clinical features", years: ["2019", "2021", "2023"] },
        { title: "Write short notes on: Hashimoto's thyroiditis", years: ["2018", "2020", "2022"] },
        { title: "Write short notes on: Follicular carcinoma thyroid", years: ["2017", "2021"] },
        { title: "Write short notes on: Medullary carcinoma thyroid", years: ["2019", "2022", "2023"] },
        { title: "Write short notes on: Diabetic nephropathy", years: ["2018", "2021"] },
        { title: "Write short notes on: Diabetic retinopathy", years: ["2020", "2022"] },
        { title: "Write short notes on: Cushing's syndrome - pathology and clinical features", years: ["2017", "2021", "2023"] },
        { title: "Write short notes on: Addison's disease", years: ["2019", "2022"] }
      ],
      2: [
        { title: "Define: Graves' disease", years: ["2019", "2021", "2023"] },
        { title: "Define: Psammoma bodies", years: ["2018", "2020", "2022"] },
        { title: "Define: Hürthle cells", years: ["2017", "2021"] },
        { title: "Define: Amyloid in medullary carcinoma", years: ["2019", "2022", "2023"] },
        { title: "Define: Hba1c", years: ["2018", "2021"] },
        { title: "Define: Diabetic ketoacidosis", years: ["2020", "2022"] },
        { title: "Define: Acromegaly", years: ["2017", "2021", "2023"] },
        { title: "Define: SIADH", years: ["2019", "2023"] }
      ]
    },
    "Reproductive System": {
      10: [
        { title: "Define and classify tumors of testis. Describe the pathology of seminoma and teratoma.", years: ["2017", "2019", "2021", "2023"] },
        { title: "Define and classify tumors of ovary. Describe the pathology of serous and mucinous cystadenoma.", years: ["2018", "2020", "2022"] },
        { title: "Define and classify carcinoma breast. Describe the pathology and staging of breast carcinoma.", years: ["2017", "2020", "2022", "2023"] },
        { title: "Define and classify tumors of uterus. Describe the pathology of endometrial carcinoma.", years: ["2018", "2021", "2023"] },
        { title: "Define and classify carcinoma cervix. Describe the pathology and staging of cervical carcinoma.", years: ["2019", "2022"] }
      ],
      5: [
        { title: "Write short notes on: Fibroadenoma breast", years: ["2019", "2021", "2023"] },
        { title: "Write short notes on: Phyllodes tumor", years: ["2018", "2020", "2022"] },
        { title: "Write short notes on: Ductal carcinoma in situ (DCIS)", years: ["2017", "2021"] },
        { title: "Write short notes on: Infiltrating duct carcinoma breast", years: ["2019", "2022", "2023"] },
        { title: "Write short notes on: Leiomyoma uterus", years: ["2018", "2021"] },
        { title: "Write short notes on: CIN (Cervical intraepithelial neoplasia)", years: ["2020", "2022"] },
        { title: "Write short notes on: Dysgerminoma ovary", years: ["2017", "2021", "2023"] },
        { title: "Write short notes on: Polycystic ovarian syndrome", years: ["2019", "2022"] }
      ],
      2: [
        { title: "Define: BRCA genes", years: ["2019", "2021", "2023"] },
        { title: "Define: Paget's disease of breast", years: ["2018", "2020", "2022"] },
        { title: "Define: Peau d'orange appearance", years: ["2017", "2021"] },
        { title: "Define: HER2/neu receptor", years: ["2019", "2022", "2023"] },
        { title: "Define: Estrogen receptor status", years: ["2018", "2021"] },
        { title: "Define: Krukenberg tumor", years: ["2020", "2022"] },
        { title: "Define: HPV infection in cervix", years: ["2017", "2021", "2023"] },
        { title: "Define: PAP smear", years: ["2019", "2023"] }
      ]
    },
    "Musculoskeletal System": {
      10: [
        { title: "Define and classify bone tumors. Describe the pathology of osteosarcoma.", years: ["2018", "2020", "2022"] },
        { title: "Define and classify arthritis. Describe the pathology of rheumatoid arthritis.", years: ["2017", "2019", "2021", "2023"] },
        { title: "Define and classify soft tissue tumors. Describe the pathology of liposarcoma.", years: ["2018", "2021", "2023"] },
        { title: "Define and classify osteomyelitis. Describe the pathology of acute and chronic osteomyelitis.", years: ["2019", "2022"] },
        { title: "Define and classify metabolic bone diseases. Describe the pathology of osteoporosis and rickets.", years: ["2017", "2020", "2022"] }
      ],
      5: [
        { title: "Write short notes on: Giant cell tumor of bone", years: ["2019", "2021", "2023"] },
        { title: "Write short notes on: Osteochondroma", years: ["2018", "2020", "2022"] },
        { title: "Write short notes on: Ewing's sarcoma", years: ["2017", "2021"] },
        { title: "Write short notes on: Chondrosarcoma", years: ["2019", "2022", "2023"] },
        { title: "Write short notes on: Osteoarthritis - pathology and clinical features", years: ["2018", "2021"] },
        { title: "Write short notes on: Gout - pathogenesis and pathology", years: ["2020", "2022"] },
        { title: "Write short notes on: Ankylosing spondylitis", years: ["2017", "2021", "2023"] },
        { title: "Write short notes on: Rhabdomyosarcoma", years: ["2019", "2022"] }
      ],
      2: [
        { title: "Define: Pannus formation in RA", years: ["2019", "2021", "2023"] },
        { title: "Define: Codman's triangle", years: ["2018", "2020", "2022"] },
        { title: "Define: Sunray appearance in osteosarcoma", years: ["2017", "2021"] },
        { title: "Define: Rheumatoid factor", years: ["2019", "2022", "2023"] },
        { title: "Define: Tophi in gout", years: ["2018", "2021"] },
        { title: "Define: Hyperuricemia", years: ["2020", "2022"] },
        { title: "Define: Pathological fracture", years: ["2017", "2021", "2023"] },
        { title: "Define: Looser's zones", years: ["2019", "2023"] }
      ]
    },
    "Nervous System": {
      10: [
        { title: "Define and classify stroke. Describe the pathology of cerebral infarction and intracerebral hemorrhage.", years: ["2017", "2019", "2021", "2023"] },
        { title: "Define and classify CNS tumors. Describe the pathology of glioblastoma multiforme.", years: ["2018", "2020", "2022"] },
        { title: "Define and classify meningitis. Describe the pathology of acute bacterial meningitis.", years: ["2019", "2021", "2023"] },
        { title: "Define and classify neurodegenerative diseases. Describe the pathology of Alzheimer's disease.", years: ["2017", "2020", "2022"] },
        { title: "Define and classify demyelinating diseases. Describe the pathology of multiple sclerosis.", years: ["2018", "2021", "2023"] }
      ],
      5: [
        { title: "Write short notes on: Subarachnoid hemorrhage", years: ["2019", "2021", "2023"] },
        { title: "Write short notes on: Subdural hematoma", years: ["2018", "2020", "2022"] },
        { title: "Write short notes on: Extradural hematoma", years: ["2017", "2021"] },
        { title: "Write short notes on: Meningioma - pathology and prognosis", years: ["2019", "2022", "2023"] },
        { title: "Write short notes on: Medulloblastoma", years: ["2018", "2021"] },
        { title: "Write short notes on: Schwannoma", years: ["2020", "2022"] },
        { title: "Write short notes on: Parkinson's disease - pathology", years: ["2017", "2021", "2023"] },
        { title: "Write short notes on: Brain abscess", years: ["2019", "2022"] }
      ],
      2: [
        { title: "Define: Cerebral edema", years: ["2019", "2021", "2023"] },
        { title: "Define: Herniation of brain", years: ["2018", "2020", "2022"] },
        { title: "Define: Hydrocephalus", years: ["2017", "2021"] },
        { title: "Define: Pseudopalisading necrosis", years: ["2019", "2022", "2023"] },
        { title: "Define: Neurofibrillary tangles", years: ["2018", "2021"] },
        { title: "Define: Amyloid plaques", years: ["2020", "2022"] },
        { title: "Define: Lewy bodies", years: ["2017", "2021", "2023"] },
        { title: "Define: Demyelination", years: ["2019", "2023"] }
      ]
    }
  },

  "Pharmacology": {
    "General Pharmacology": {
      10: [
        { title: "Define pharmacokinetics. Describe the various processes of drug absorption and factors affecting it.", years: ["2018", "2020", "2022"] },
        { title: "Define pharmacodynamics. Describe the various mechanisms of drug action with examples.", years: ["2017", "2019", "2021", "2023"] },
        { title: "Define drug interactions. Classify and describe the mechanisms of drug interactions with examples.", years: ["2018", "2021", "2023"] },
        { title: "Define adverse drug reactions. Classify and describe the types of adverse drug reactions with examples.", years: ["2019", "2022"] },
        { title: "Describe the various routes of drug administration. Compare their advantages and disadvantages.", years: ["2017", "2020", "2022"] }
      ],
      5: [
        { title: "Write short notes on: First pass metabolism", years: ["2019", "2021", "2023"] },
        { title: "Write short notes on: Bioavailability", years: ["2018", "2020", "2022"] },
        { title: "Write short notes on: Half-life of drugs", years: ["2017", "2021"] },
        { title: "Write short notes on: Volume of distribution", years: ["2019", "2022", "2023"] },
        { title: "Write short notes on: Drug clearance", years: ["2018", "2021"] },
        { title: "Write short notes on: Steady state concentration", years: ["2020", "2022"] },
        { title: "Write short notes on: Therapeutic index", years: ["2017", "2021", "2023"] },
        { title: "Write short notes on: Placebo effect", years: ["2019", "2022"] },
        { title: "Write short notes on: Drug tolerance and dependence", years: ["2018", "2021"] },
        { title: "Write short notes on: Dose-response relationship", years: ["2020", "2023"] }
      ],
      2: [
        { title: "Define: Agonist", years: ["2019", "2021", "2023"] },
        { title: "Define: Antagonist", years: ["2018", "2020", "2022"] },
        { title: "Define: Competitive antagonism", years: ["2017", "2021"] },
        { title: "Define: Non-competitive antagonism", years: ["2019", "2022", "2023"] },
        { title: "Define: ED50", years: ["2018", "2021"] },
        { title: "Define: LD50", years: ["2020", "2022"] },
        { title: "Define: Potency", years: ["2017", "2021", "2023"] },
        { title: "Define: Efficacy", years: ["2019", "2023"] },
        { title: "Define: Prodrug", years: ["2018", "2022"] },
        { title: "Define: Loading dose", years: ["2020", "2021"] }
      ]
    },
    "Autonomic Nervous System": {
      10: [
        { title: "Classify cholinergic drugs. Describe the mechanism of action, uses, and adverse effects of acetylcholine esterase inhibitors.", years: ["2017", "2019", "2021", "2023"] },
        { title: "Classify adrenergic drugs. Describe the mechanism of action, uses, and adverse effects of sympathomimetics.", years: ["2018", "2020", "2022"] },
        { title: "Classify adrenergic blockers. Describe the mechanism of action and uses of alpha and beta blockers.", years: ["2019", "2021", "2023"] },
        { title: "Classify skeletal muscle relaxants. Describe the mechanism of action and uses of neuromuscular blockers.", years: ["2017", "2020", "2022"] },
        { title: "Classify cholinergic blockers. Describe the mechanism of action, uses, and adverse effects of atropine.", years: ["2018", "2021", "2023"] }
      ],
      5: [
        { title: "Write short notes on: Atropine - uses and adverse effects", years: ["2019", "2021", "2023"] },
        { title: "Write short notes on: Neostigmine - mechanism and uses", years: ["2018", "2020", "2022"] },
        { title: "Write short notes on: Propranolol - uses and contraindications", years: ["2017", "2021"] },
        { title: "Write short notes on: Prazosin - mechanism and uses", years: ["2019", "2022", "2023"] },
        { title: "Write short notes on: Phenylephrine - mechanism and uses", years: ["2018", "2021"] },
        { title: "Write short notes on: Salbutamol - mechanism and uses", years: ["2020", "2022"] },
        { title: "Write short notes on: Organophosphate poisoning and treatment", years: ["2017", "2021", "2023"] },
        { title: "Write short notes on: Succinylcholine - mechanism and adverse effects", years: ["2019", "2022"] }
      ],
      2: [
        { title: "Define: Muscarinic receptors", years: ["2019", "2021", "2023"] },
        { title: "Define: Nicotinic receptors", years: ["2018", "2020", "2022"] },
        { title: "Define: Alpha-1 receptors", years: ["2017", "2021"] },
        { title: "Define: Beta-2 receptors", years: ["2019", "2022", "2023"] },
        { title: "Define: Mydriasis", years: ["2018", "2021"] },
        { title: "Define: Cycloplegia", years: ["2020", "2022"] },
        { title: "Define: Miosis", years: ["2017", "2021", "2023"] },
        { title: "Define: Tachyphylaxis", years: ["2019", "2023"] }
      ]
    },
    "Cardiovascular Drugs": {
      10: [
        { title: "Classify antihypertensive drugs. Describe the mechanism of action and uses of ACE inhibitors.", years: ["2017", "2019", "2021", "2023"] },
        { title: "Classify antianginal drugs. Describe the mechanism of action and uses of nitrates.", years: ["2018", "2020", "2022"] },
        { title: "Classify antiarrhythmic drugs. Describe the Vaughan Williams classification with examples.", years: ["2019", "2021", "2023"] },
        { title: "Classify drugs used in heart failure. Describe the mechanism of action and uses of digoxin.", years: ["2017", "2020", "2022"] },
        { title: "Classify diuretics. Describe the mechanism of action and uses of loop diuretics.", years: ["2018", "2021", "2023"] }
      ],
      5: [
        { title: "Write short notes on: Amlodipine - mechanism and uses", years: ["2019", "2021", "2023"] },
        { title: "Write short notes on: Losartan - mechanism and uses", years: ["2018", "2020", "2022"] },
        { title: "Write short notes on: Atenolol - mechanism and uses", years: ["2017", "2021"] },
        { title: "Write short notes on: Furosemide - mechanism and adverse effects", years: ["2019", "2022", "2023"] },
        { title: "Write short notes on: Hydrochlorothiazide - uses and adverse effects", years: ["2018", "2021"] },
        { title: "Write short notes on: Spironolactone - mechanism and uses", years: ["2020", "2022"] },
        { title: "Write short notes on: Amiodarone - mechanism and adverse effects", years: ["2017", "2021", "2023"] },
        { title: "Write short notes on: Streptokinase - mechanism and uses", years: ["2019", "2022"] }
      ],
      2: [
        { title: "Define: ACE inhibitors - adverse effects", years: ["2019", "2021", "2023"] },
        { title: "Define: Nitrate tolerance", years: ["2018", "2020", "2022"] },
        { title: "Define: Calcium channel blockers", years: ["2017", "2021"] },
        { title: "Define: Digitalis toxicity", years: ["2019", "2022", "2023"] },
        { title: "Define: Hypokalemia with diuretics", years: ["2018", "2021"] },
        { title: "Define: Hyperuricemia with thiazides", years: ["2020", "2022"] },
        { title: "Define: ACE vs ARB", years: ["2017", "2021", "2023"] },
        { title: "Define: Thrombolytic therapy", years: ["2019", "2023"] }
      ]
    },
    "Respiratory Drugs": {
      10: [
        { title: "Classify anti-asthma drugs. Describe the mechanism of action and management of bronchial asthma.", years: ["2018", "2020", "2022"] },
        { title: "Classify bronchodilators. Describe the mechanism of action and uses of beta-2 agonists.", years: ["2017", "2019", "2021", "2023"] },
        { title: "Describe the mechanism of action and uses of corticosteroids in respiratory diseases.", years: ["2018", "2021", "2023"] },
        { title: "Classify antitussives and expectorants. Describe their mechanism of action and uses.", years: ["2019", "2022"] }
      ],
      5: [
        { title: "Write short notes on: Salbutamol - mechanism and adverse effects", years: ["2019", "2021", "2023"] },
        { title: "Write short notes on: Ipratropium bromide", years: ["2018", "2020", "2022"] },
        { title: "Write short notes on: Theophylline - mechanism and uses", years: ["2017", "2021"] },
        { title: "Write short notes on: Montelukast - mechanism and uses", years: ["2019", "2022", "2023"] },
        { title: "Write short notes on: Budesonide - uses and adverse effects", years: ["2018", "2021"] },
        { title: "Write short notes on: Sodium cromoglycate", years: ["2020", "2022"] },
        { title: "Write short notes on: Codeine as antitussive", years: ["2017", "2021", "2023"] },
        { title: "Write short notes on: Doxophylline", years: ["2019", "2022"] }
      ],
      2: [
        { title: "Define: Beta-2 agonists - tremors", years: ["2019", "2021", "2023"] },
        { title: "Define: Metered dose inhaler", years: ["2018", "2020", "2022"] },
        { title: "Define: Dry powder inhaler", years: ["2017", "2021"] },
        { title: "Define: Nebulization", years: ["2019", "2022", "2023"] },
        { title: "Define: Leukotriene modifiers", years: ["2018", "2021"] },
        { title: "Define: Mast cell stabilizers", years: ["2020", "2022"] },
        { title: "Define: Status asthmaticus treatment", years: ["2017", "2021", "2023"] },
        { title: "Define: Oxygen therapy in COPD", years: ["2019", "2023"] }
      ]
    },
    "Gastrointestinal Drugs": {
      10: [
        { title: "Classify anti-ulcer drugs. Describe the mechanism of action and uses of proton pump inhibitors.", years: ["2017", "2019", "2021", "2023"] },
        { title: "Classify antiemetics. Describe the mechanism of action and uses of 5-HT3 antagonists.", years: ["2018", "2020", "2022"] },
        { title: "Classify laxatives. Describe the mechanism of action and uses of different types of laxatives.", years: ["2019", "2021", "2023"] },
        { title: "Describe the pharmacotherapy of inflammatory bowel disease.", years: ["2017", "2020", "2022"] }
      ],
      5: [
        { title: "Write short notes on: Ranitidine - mechanism and uses", years: ["2019", "2021", "2023"] },
        { title: "Write short notes on: Omeprazole - mechanism and adverse effects", years: ["2018", "2020", "2022"] },
        { title: "Write short notes on: Ondansetron - mechanism and uses", years: ["2017", "2021"] },
        { title: "Write short notes on: Metoclopramide - mechanism and adverse effects", years: ["2019", "2022", "2023"] },
        { title: "Write short notes on: Sucralfate - mechanism and uses", years: ["2018", "2021"] },
        { title: "Write short notes on: Misoprostol - mechanism and uses", years: ["2020", "2022"] },
        { title: "Write short notes on: Antacids - types and uses", years: ["2017", "2021", "2023"] },
        { title: "Write short notes on: Loperamide - mechanism and uses", years: ["2019", "2022"] }
      ],
      2: [
        { title: "Define: H2 receptor blockers", years: ["2019", "2021", "2023"] },
        { title: "Define: PPIs - long term effects", years: ["2018", "2020", "2022"] },
        { title: "Define: Prokinetic agents", years: ["2017", "2021"] },
        { title: "Define: Antidiarrheal drugs", years: ["2019", "2022", "2023"] },
        { title: "Define: Osmotic laxatives", years: ["2018", "2021"] },
        { title: "Define: Bulk forming laxatives", years: ["2020", "2022"] },
        { title: "Define: H. pylori eradication therapy", years: ["2017", "2021", "2023"] },
        { title: "Define: Antispasmodics", years: ["2019", "2023"] }
      ]
    },
    "Antimicrobials": {
      10: [
        { title: "Classify penicillins. Describe the mechanism of action, uses, and adverse effects of penicillins.", years: ["2017", "2019", "2021", "2023"] },
        { title: "Classify cephalosporins. Describe the mechanism of action and uses of different generations of cephalosporins.", years: ["2018", "2020", "2022"] },
        { title: "Classify aminoglycosides. Describe the mechanism of action, uses, and adverse effects of aminoglycosides.", years: ["2019", "2021", "2023"] },
        { title: "Classify fluoroquinolones. Describe the mechanism of action and uses of fluoroquinolones.", years: ["2017", "2020", "2022"] },
        { title: "Classify antitubercular drugs. Describe the mechanism of action and adverse effects of first-line antitubercular drugs.", years: ["2018", "2021", "2023"] }
      ],
      5: [
        { title: "Write short notes on: Amoxicillin-clavulanate combination", years: ["2019", "2021", "2023"] },
        { title: "Write short notes on: Ceftriaxone - uses and adverse effects", years: ["2018", "2020", "2022"] },
        { title: "Write short notes on: Gentamicin - mechanism and toxicity", years: ["2017", "2021"] },
        { title: "Write short notes on: Ciprofloxacin - uses and contraindications", years: ["2019", "2022", "2023"] },
        { title: "Write short notes on: Azithromycin - mechanism and uses", years: ["2018", "2021"] },
        { title: "Write short notes on: Doxycycline - uses and adverse effects", years: ["2020", "2022"] },
        { title: "Write short notes on: Metronidazole - mechanism and uses", years: ["2017", "2021", "2023"] },
        { title: "Write short notes on: Vancomycin - mechanism and uses", years: ["2019", "2022"] },
        { title: "Write short notes on: Isoniazid - mechanism and adverse effects", years: ["2018", "2021"] },
        { title: "Write short notes on: Rifampicin - mechanism and uses", years: ["2020", "2023"] }
      ],
      2: [
        { title: "Define: Beta-lactamase inhibitors", years: ["2019", "2021", "2023"] },
        { title: "Define: MRSA treatment", years: ["2018", "2020", "2022"] },
        { title: "Define: Ototoxicity", years: ["2017", "2021"] },
        { title: "Define: Nephrotoxicity of aminoglycosides", years: ["2019", "2022", "2023"] },
        { title: "Define: DOTS therapy", years: ["2018", "2021"] },
        { title: "Define: Multidrug resistant TB", years: ["2020", "2022"] },
        { title: "Define: Antibiotic prophylaxis", years: ["2017", "2021", "2023"] },
        { title: "Define: Superinfection", years: ["2019", "2023"] }
      ]
    },
    "Central Nervous System Drugs": {
      10: [
        { title: "Classify sedatives and hypnotics. Describe the mechanism of action and uses of benzodiazepines.", years: ["2018", "2020", "2022"] },
        { title: "Classify antiepileptic drugs. Describe the mechanism of action and uses of phenytoin and valproic acid.", years: ["2017", "2019", "2021", "2023"] },
        { title: "Classify antidepressants. Describe the mechanism of action and uses of SSRIs.", years: ["2018", "2021", "2023"] },
        { title: "Classify antipsychotics. Describe the mechanism of action and adverse effects of typical antipsychotics.", years: ["2019", "2022"] },
        { title: "Classify analgesics. Describe the mechanism of action and uses of opioids.", years: ["2017", "2020", "2022"] }
      ],
      5: [
        { title: "Write short notes on: Diazepam - uses and adverse effects", years: ["2019", "2021", "2023"] },
        { title: "Write short notes on: Phenobarbitone - mechanism and uses", years: ["2018", "2020", "2022"] },
        { title: "Write short notes on: Carbamazepine - mechanism and adverse effects", years: ["2017", "2021"] },
        { title: "Write short notes on: Fluoxetine - mechanism and uses", years: ["2019", "2022", "2023"] },
        { title: "Write short notes on: Haloperidol - adverse effects", years: ["2018", "2021"] },
        { title: "Write short notes on: Morphine - mechanism and adverse effects", years: ["2020", "2022"] },
        { title: "Write short notes on: Tramadol - mechanism and uses", years: ["2017", "2021", "2023"] },
        { title: "Write short notes on: Parkinsonism - drug therapy", years: ["2019", "2022"] }
      ],
      2: [
        { title: "Define: GABA receptors", years: ["2019", "2021", "2023"] },
        { title: "Define: Status epilepticus treatment", years: ["2018", "2020", "2022"] },
        { title: "Define: Extrapyramidal side effects", years: ["2017", "2021"] },
        { title: "Define: Tardive dyskinesia", years: ["2019", "2022", "2023"] },
        { title: "Define: Serotonin syndrome", years: ["2018", "2021"] },
        { title: "Define: Opioid antagonists", years: ["2020", "2022"] },
        { title: "Define: NSAIDs - mechanism", years: ["2017", "2021", "2023"] },
        { title: "Define: Analgesic nephropathy", years: ["2019", "2023"] }
      ]
    },
    "Endocrine Drugs": {
      10: [
        { title: "Classify oral hypoglycemic agents. Describe the mechanism of action and uses of sulfonylureas and metformin.", years: ["2017", "2019", "2021", "2023"] },
        { title: "Describe the types, mechanism of action, and uses of insulin preparations.", years: ["2018", "2020", "2022"] },
        { title: "Classify corticosteroids. Describe the mechanism of action, uses, and adverse effects of glucocorticoids.", years: ["2019", "2021", "2023"] },
        { title: "Classify thyroid drugs. Describe the pharmacotherapy of thyrotoxicosis.", years: ["2017", "2020", "2022"] }
      ],
      5: [
        { title: "Write short notes on: Metformin - mechanism and adverse effects", years: ["2019", "2021", "2023"] },
        { title: "Write short notes on: Glimepiride - mechanism and uses", years: ["2018", "2020", "2022"] },
        { title: "Write short notes on: DPP-4 inhibitors", years: ["2017", "2021"] },
        { title: "Write short notes on: Prednisolone - uses and adverse effects", years: ["2019", "2022", "2023"] },
        { title: "Write short notes on: Carbimazole - mechanism and uses", years: ["2018", "2021"] },
        { title: "Write short notes on: Levothyroxine - uses", years: ["2020", "2022"] },
        { title: "Write short notes on: Insulin glargine", years: ["2017", "2021", "2023"] },
        { title: "Write short notes on: Diabetic ketoacidosis management", years: ["2019", "2022"] }
      ],
      2: [
        { title: "Define: Hypoglycemia", years: ["2019", "2021", "2023"] },
        { title: "Define: Lactic acidosis with metformin", years: ["2018", "2020", "2022"] },
        { title: "Define: Cushing's syndrome - steroid induced", years: ["2017", "2021"] },
        { title: "Define: HPA axis suppression", years: ["2019", "2022", "2023"] },
        { title: "Define: Thyroid storm", years: ["2018", "2021"] },
        { title: "Define: GLP-1 agonists", years: ["2020", "2022"] },
        { title: "Define: Oral contraceptives", years: ["2017", "2021", "2023"] },
        { title: "Define: HRT (Hormone replacement therapy)", years: ["2019", "2023"] }
      ]
    },
    "Chemotherapy": {
      10: [
        { title: "Classify anticancer drugs. Describe the mechanism of action and adverse effects of alkylating agents.", years: ["2018", "2020", "2022"] },
        { title: "Describe the mechanism of action and uses of antimetabolites in cancer chemotherapy.", years: ["2017", "2019", "2021", "2023"] },
        { title: "Classify immunosuppressants. Describe their mechanism of action and uses.", years: ["2018", "2021", "2023"] }
      ],
      5: [
        { title: "Write short notes on: Cyclophosphamide - mechanism and toxicity", years: ["2019", "2021", "2023"] },
        { title: "Write short notes on: Methotrexate - mechanism and uses", years: ["2018", "2020", "2022"] },
        { title: "Write short notes on: 5-Fluorouracil - mechanism and uses", years: ["2017", "2021"] },
        { title: "Write short notes on: Doxorubicin - mechanism and cardiotoxicity", years: ["2019", "2022", "2023"] },
        { title: "Write short notes on: Vincristine - mechanism and neurotoxicity", years: ["2018", "2021"] },
        { title: "Write short notes on: Cisplatin - mechanism and toxicity", years: ["2020", "2022"] },
        { title: "Write short notes on: Cyclosporine - mechanism and uses", years: ["2017", "2021", "2023"] },
        { title: "Write short notes on: Targeted therapy in cancer", years: ["2019", "2022"] }
      ],
      2: [
        { title: "Define: Myelosuppression", years: ["2019", "2021", "2023"] },
        { title: "Define: Mucositis", years: ["2018", "2020", "2022"] },
        { title: "Define: Alopecia with chemotherapy", years: ["2017", "2021"] },
        { title: "Define: Nausea and vomiting - chemotherapy induced", years: ["2019", "2022", "2023"] },
        { title: "Define: Tyrosine kinase inhibitors", years: ["2018", "2021"] },
        { title: "Define: Monoclonal antibodies in cancer", years: ["2020", "2022"] },
        { title: "Define: Rituximab", years: ["2017", "2021", "2023"] },
        { title: "Define: Imatinib", years: ["2019", "2023"] }
      ]
    },
    "Autacoids and Related Drugs": {
      10: [
        { title: "Classify antihistamines. Describe the mechanism of action and uses of H1 receptor antagonists.", years: ["2017", "2019", "2021", "2023"] },
        { title: "Classify NSAIDs. Describe the mechanism of action and uses of aspirin.", years: ["2018", "2020", "2022"] },
        { title: "Describe the mechanism of action and uses of prostaglandins in clinical practice.", years: ["2019", "2021", "2023"] }
      ],
      5: [
        { title: "Write short notes on: Cetirizine - mechanism and uses", years: ["2019", "2021", "2023"] },
        { title: "Write short notes on: Promethazine - uses and adverse effects", years: ["2018", "2020", "2022"] },
        { title: "Write short notes on: Ibuprofen - mechanism and uses", years: ["2017", "2021"] },
        { title: "Write short notes on: Diclofenac - mechanism and adverse effects", years: ["2019", "2022", "2023"] },
        { title: "Write short notes on: Paracetamol - mechanism and toxicity", years: ["2018", "2021"] },
        { title: "Write short notes on: Celecoxib - mechanism and uses", years: ["2020", "2022"] },
        { title: "Write short notes on: Misoprostol - mechanism and uses", years: ["2017", "2021", "2023"] },
        { title: "Write short notes on: 5-HT3 antagonists", years: ["2019", "2022"] }
      ],
      2: [
        { title: "Define: Histamine receptors", years: ["2019", "2021", "2023"] },
        { title: "Define: COX-1 vs COX-2", years: ["2018", "2020", "2022"] },
        { title: "Define: Selective COX-2 inhibitors", years: ["2017", "2021"] },
        { title: "Define: Gastric toxicity of NSAIDs", years: ["2019", "2022", "2023"] },
        { title: "Define: Reye's syndrome", years: ["2018", "2021"] },
        { title: "Define: Anaphylaxis treatment", years: ["2020", "2022"] },
        { title: "Define: Antiplatelet effect of aspirin", years: ["2017", "2021", "2023"] },
        { title: "Define: Leukotrienes", years: ["2019", "2023"] }
      ]
    }
  },

  "Microbiology": {
    "General Microbiology": {
      10: [
        { title: "Define sterilization. Describe the various methods of sterilization with their applications.", years: ["2017", "2019", "2021", "2023"] },
        { title: "Define disinfection. Describe the properties of ideal disinfectants and methods of testing disinfectants.", years: ["2018", "2020", "2022"] },
        { title: "Describe the various culture media used in microbiology laboratory with their applications.", years: ["2019", "2021", "2023"] },
        { title: "Describe the structure of bacterial cell wall. Compare gram-positive and gram-negative cell wall.", years: ["2017", "2020", "2022"] },
        { title: "Describe the bacterial spore structure and its significance in sterilization.", years: ["2018", "2021", "2023"] }
      ],
      5: [
        { title: "Write short notes on: Autoclave - principle and uses", years: ["2019", "2021", "2023"] },
        { title: "Write short notes on: Hot air oven", years: ["2018", "2020", "2022"] },
        { title: "Write short notes on: Filtration methods", years: ["2017", "2021"] },
        { title: "Write short notes on: Gram staining - principle and procedure", years: ["2019", "2022", "2023"] },
        { title: "Write short notes on: Ziehl-Neelsen staining", years: ["2018", "2021"] },
        { title: "Write short notes on: Bacterial growth curve", years: ["2020", "2022"] },
        { title: "Write short notes on: Culture media - types and uses", years: ["2017", "2021", "2023"] },
        { title: "Write short notes on: McFarland standard", years: ["2019", "2022"] }
      ],
      2: [
        { title: "Define: Sterilization vs Disinfection", years: ["2019", "2021", "2023"] },
        { title: "Define: Antisepsis", years: ["2018", "2020", "2022"] },
        { title: "Define: Asepsis", years: ["2017", "2021"] },
        { title: "Define: Bactericidal vs Bacteriostatic", years: ["2019", "2022", "2023"] },
        { title: "Define: Spore", years: ["2018", "2021"] },
        { title: "Define: Capsule", years: ["2020", "2022"] },
        { title: "Define: Flagella", years: ["2017", "2021", "2023"] },
        { title: "Define: Pili", years: ["2019", "2023"] }
      ]
    },
    "Immunology": {
      10: [
        { title: "Describe the structure and functions of immunoglobulins with diagram.", years: ["2017", "2019", "2021", "2023"] },
        { title: "Describe the structure and functions of complement system. Explain the complement pathways.", years: ["2018", "2020", "2022"] },
        { title: "Describe the mechanism of hypersensitivity reactions with examples.", years: ["2019", "2021", "2023"] },
        { title: "Describe the structure and functions of T and B lymphocytes.", years: ["2017", "2020", "2022"] },
        { title: "Describe the various antigen-antibody reactions and their applications in diagnosis.", years: ["2018", "2021", "2023"] }
      ],
      5: [
        { title: "Write short notes on: IgG - structure and functions", years: ["2019", "2021", "2023"] },
        { title: "Write short notes on: IgM - structure and significance", years: ["2018", "2020", "2022"] },
        { title: "Write short notes on: IgE and allergic reactions", years: ["2017", "2021"] },
        { title: "Write short notes on: ELISA - principle and applications", years: ["2019", "2022", "2023"] },
        { title: "Write short notes on: Western blot", years: ["2018", "2021"] },
        { title: "Write short notes on: Anaphylaxis - mechanism and management", years: ["2020", "2022"] },
        { title: "Write short notes on: Autoimmunity", years: ["2017", "2021", "2023"] },
        { title: "Write short notes on: MHC complex", years: ["2019", "2022"] }
      ],
      2: [
        { title: "Define: Antigen", years: ["2019", "2021", "2023"] },
        { title: "Define: Antibody", years: ["2018", "2020", "2022"] },
        { title: "Define: Hapten", years: ["2017", "2021"] },
        { title: "Define: Epitope", years: ["2019", "2022", "2023"] },
        { title: "Define: Opsonization", years: ["2018", "2021"] },
        { title: "Define: Neutralization", years: ["2020", "2022"] },
        { title: "Define: Memory cells", years: ["2017", "2021", "2023"] },
        { title: "Define: Plasma cells", years: ["2019", "2023"] }
      ]
    },
    "Bacteriology - Gram Positive Cocci": {
      10: [
        { title: "Describe the morphology, cultural characteristics, and laboratory diagnosis of Staphylococcus aureus.", years: ["2017", "2019", "2021", "2023"] },
        { title: "Describe the morphology, cultural characteristics, and laboratory diagnosis of Streptococcus pyogenes.", years: ["2018", "2020", "2022"] },
        { title: "Describe the morphology, pathogenesis, and laboratory diagnosis of Streptococcus pneumoniae.", years: ["2019", "2021", "2023"] },
        { title: "Describe the virulence factors and diseases caused by Staphylococcus aureus.", years: ["2017", "2020", "2022"] },
        { title: "Describe the post-streptococcal complications and their pathogenesis.", years: ["2018", "2021", "2023"] }
      ],
      5: [
        { title: "Write short notes on: Coagulase test", years: ["2019", "2021", "2023"] },
        { title: "Write short notes on: Lancefield grouping", years: ["2018", "2020", "2022"] },
        { title: "Write short notes on: MRSA", years: ["2017", "2021"] },
        { title: "Write short notes on: Toxic shock syndrome", years: ["2019", "2022", "2023"] },
        { title: "Write short notes on: Scalded skin syndrome", years: ["2018", "2021"] },
        { title: "Write short notes on: Rheumatic fever", years: ["2020", "2022"] },
        { title: "Write short notes on: Optochin sensitivity test", years: ["2017", "2021", "2023"] },
        { title: "Write short notes on: Quellung reaction", years: ["2019", "2022"] }
      ],
      2: [
        { title: "Define: Coagulase positive staph", years: ["2019", "2021", "2023"] },
        { title: "Define: Beta hemolysis", years: ["2018", "2020", "2022"] },
        { title: "Define: Alpha hemolysis", years: ["2017", "2021"] },
        { title: "Define: Bacitracin test", years: ["2019", "2022", "2023"] },
        { title: "Define: Pneumococcal vaccine", years: ["2018", "2021"] },
        { title: "Define: ASO titer", years: ["2020", "2022"] },
        { title: "Define: Enterotoxin of S. aureus", years: ["2017", "2021", "2023"] },
        { title: "Define: Viridans streptococci", years: ["2019", "2023"] }
      ]
    },
    "Bacteriology - Gram Negative Bacilli": {
      10: [
        { title: "Describe the morphology, cultural characteristics, and laboratory diagnosis of Escherichia coli.", years: ["2017", "2019", "2021", "2023"] },
        { title: "Describe the pathogenesis and laboratory diagnosis of typhoid fever.", years: ["2018", "2020", "2022"] },
        { title: "Describe the morphology, pathogenesis, and laboratory diagnosis of Vibrio cholerae.", years: ["2019", "2021", "2023"] },
        { title: "Describe the laboratory diagnosis of urinary tract infection.", years: ["2017", "2020", "2022"] },
        { title: "Describe the morphology, pathogenesis, and laboratory diagnosis of Pseudomonas aeruginosa.", years: ["2018", "2021", "2023"] }
      ],
      5: [
        { title: "Write short notes on: Widal test", years: ["2019", "2021", "2023"] },
        { title: "Write short notes on: Blood culture in typhoid", years: ["2018", "2020", "2022"] },
        { title: "Write short notes on: Cholera toxin mechanism", years: ["2017", "2021"] },
        { title: "Write short notes on: Rice water stool", years: ["2019", "2022", "2023"] },
        { title: "Write short notes on: MacConkey's agar", years: ["2018", "2021"] },
        { title: "Write short notes on: Triple sugar iron agar", years: ["2020", "2022"] },
        { title: "Write short notes on: Shigella - pathogenesis", years: ["2017", "2021", "2023"] },
        { title: "Write short notes on: Klebsiella pneumoniae", years: ["2019", "2022"] }
      ],
      2: [
        { title: "Define: Lactose fermenter", years: ["2019", "2021", "2023"] },
        { title: "Define: Non-lactose fermenter", years: ["2018", "2020", "2022"] },
        { title: "Define: O antigen", years: ["2017", "2021"] },
        { title: "Define: H antigen", years: ["2019", "2022", "2023"] },
        { title: "Define: Vi antigen", years: ["2018", "2021"] },
        { title: "Define: Enterotoxigenic E. coli", years: ["2020", "2022"] },
        { title: "Define: ORS composition", years: ["2017", "2021", "2023"] },
        { title: "Define: Oxidase test", years: ["2019", "2023"] }
      ]
    },
    "Mycobacteriology": {
      10: [
        { title: "Describe the morphology, cultural characteristics, and laboratory diagnosis of Mycobacterium tuberculosis.", years: ["2017", "2019", "2021", "2023"] },
        { title: "Describe the pathogenesis and immunology of tuberculosis.", years: ["2018", "2020", "2022"] },
        { title: "Describe the morphology, pathogenesis, and laboratory diagnosis of Mycobacterium leprae.", years: ["2019", "2021", "2023"] },
        { title: "Describe the various methods of diagnosis of tuberculosis including molecular methods.", years: ["2017", "2020", "2022"] }
      ],
      5: [
        { title: "Write short notes on: Ziehl-Neelsen staining", years: ["2019", "2021", "2023"] },
        { title: "Write short notes on: Lowenstein-Jensen medium", years: ["2018", "2020", "2022"] },
        { title: "Write short notes on: Mantoux test", years: ["2017", "2021"] },
        { title: "Write short notes on: CBNAAT/GeneXpert", years: ["2019", "2022", "2023"] },
        { title: "Write short notes on: BCG vaccine", years: ["2018", "2021"] },
        { title: "Write short notes on: Tuberculin test interpretation", years: ["2020", "2022"] },
        { title: "Write short notes on: Lepromin test", years: ["2017", "2021", "2023"] },
        { title: "Write short notes on: Multidrug resistant TB", years: ["2019", "2022"] }
      ],
      2: [
        { title: "Define: Acid-fast bacilli", years: ["2019", "2021", "2023"] },
        { title: "Define: Sputum for AFB", years: ["2018", "2020", "2022"] },
        { title: "Define: MDR-TB", years: ["2017", "2021"] },
        { title: "Define: XDR-TB", years: ["2019", "2022", "2023"] },
        { title: "Define: Dormancy in TB", years: ["2018", "2021"] },
        { title: "Define: Caseating granuloma", years: ["2020", "2022"] },
        { title: "Define: Tuberculoid leprosy", years: ["2017", "2021", "2023"] },
        { title: "Define: Lepromatous leprosy", years: ["2019", "2023"] }
      ]
    },
    "Virology": {
      10: [
        { title: "Describe the structure of viruses. Classify viruses based on nucleic acid and structure.", years: ["2017", "2019", "2021", "2023"] },
        { title: "Describe the pathogenesis, laboratory diagnosis, and prevention of Hepatitis B virus infection.", years: ["2018", "2020", "2022"] },
        { title: "Describe the pathogenesis and laboratory diagnosis of HIV infection.", years: ["2019", "2021", "2023"] },
        { title: "Describe the pathogenesis, laboratory diagnosis, and prevention of rabies.", years: ["2017", "2020", "2022"] },
        { title: "Describe the pathogenesis and laboratory diagnosis of dengue virus infection.", years: ["2018", "2021", "2023"] }
      ],
      5: [
        { title: "Write short notes on: Hepatitis B surface antigen", years: ["2019", "2021", "2023"] },
        { title: "Write short notes on: Hepatitis B vaccine", years: ["2018", "2020", "2022"] },
        { title: "Write short notes on: CD4 count in HIV", years: ["2017", "2021"] },
        { title: "Write short notes on: ELISA for HIV", years: ["2019", "2022", "2023"] },
        { title: "Write short notes on: Western blot for HIV", years: ["2018", "2021"] },
        { title: "Write short notes on: Rabies vaccine", years: ["2020", "2022"] },
        { title: "Write short notes on: Negri bodies", years: ["2017", "2021", "2023"] },
        { title: "Write short notes on: Dengue serology", years: ["2019", "2022"] },
        { title: "Write short notes on: Chikungunya virus", years: ["2018", "2021"] },
        { title: "Write short notes on: Influenza virus - structure", years: ["2020", "2023"] }
      ],
      2: [
        { title: "Define: Dane particle", years: ["2019", "2021", "2023"] },
        { title: "Define: Australia antigen", years: ["2018", "2020", "2022"] },
        { title: "Define: Window period in HIV", years: ["2017", "2021"] },
        { title: "Define: Reverse transcriptase", years: ["2019", "2022", "2023"] },
        { title: "Define: Opportunistic infections in HIV", years: ["2018", "2021"] },
        { title: "Define: Post-exposure prophylaxis", years: ["2020", "2022"] },
        { title: "Define: Herpes simplex virus", years: ["2017", "2021", "2023"] },
        { title: "Define: Varicella zoster virus", years: ["2019", "2023"] }
      ]
    },
    "Mycology": {
      10: [
        { title: "Classify fungal infections. Describe the laboratory diagnosis of superficial and deep mycoses.", years: ["2017", "2019", "2021", "2023"] },
        { title: "Describe the pathogenesis and laboratory diagnosis of systemic mycoses.", years: ["2018", "2020", "2022"] },
        { title: "Describe the morphology, pathogenesis, and laboratory diagnosis of Candida albicans.", years: ["2019", "2021", "2023"] }
      ],
      5: [
        { title: "Write short notes on: Dermatophytes", years: ["2019", "2021", "2023"] },
        { title: "Write short notes on: Tinea infections", years: ["2018", "2020", "2022"] },
        { title: "Write short notes on: Candidiasis - laboratory diagnosis", years: ["2017", "2021"] },
        { title: "Write short notes on: Oral thrush", years: ["2019", "2022", "2023"] },
        { title: "Write short notes on: Aspergillosis", years: ["2018", "2021"] },
        { title: "Write short notes on: Cryptococcal meningitis", years: ["2020", "2022"] },
        { title: "Write short notes on: KOH mount", years: ["2017", "2021", "2023"] },
        { title: "Write short notes on: Sabouraud dextrose agar", years: ["2019", "2022"] }
      ],
      2: [
        { title: "Define: Hyphae", years: ["2019", "2021", "2023"] },
        { title: "Define: Spores in fungi", years: ["2018", "2020", "2022"] },
        { title: "Define: Mycelium", years: ["2017", "2021"] },
        { title: "Define: Dimorphic fungi", years: ["2019", "2022", "2023"] },
        { title: "Define: Opportunistic fungal infections", years: ["2018", "2021"] },
        { title: "Define: Germ tube test", years: ["2020", "2022"] },
        { title: "Define: Pityriasis versicolor", years: ["2017", "2021", "2023"] },
        { title: "Define: Antifungal drugs", years: ["2019", "2023"] }
      ]
    },
    "Parasitology": {
      10: [
        { title: "Describe the life cycle, pathogenesis, and laboratory diagnosis of Plasmodium vivax.", years: ["2017", "2019", "2021", "2023"] },
        { title: "Describe the life cycle, pathogenesis, and laboratory diagnosis of Entamoeba histolytica.", years: ["2018", "2020", "2022"] },
        { title: "Describe the life cycle and laboratory diagnosis of Ascaris lumbricoides.", years: ["2019", "2021", "2023"] },
        { title: "Describe the life cycle, pathogenesis, and laboratory diagnosis of Giardia lamblia.", years: ["2017", "2020", "2022"] }
      ],
      5: [
        { title: "Write short notes on: Malaria parasite - life cycle", years: ["2019", "2021", "2023"] },
        { title: "Write short notes on: Peripheral smear for malaria", years: ["2018", "2020", "2022"] },
        { title: "Write short notes on: Malarial parasites - types", years: ["2017", "2021"] },
        { title: "Write short notes on: Amoebic liver abscess", years: ["2019", "2022", "2023"] },
        { title: "Write short notes on: Stool examination for parasites", years: ["2018", "2021"] },
        { title: "Write short notes on: Hookworm infestation", years: ["2020", "2022"] },
        { title: "Write short notes on: Filariasis - laboratory diagnosis", years: ["2017", "2021", "2023"] },
        { title: "Write short notes on: Leishmaniasis", years: ["2019", "2022"] }
      ],
      2: [
        { title: "Define: Trophozoite", years: ["2019", "2021", "2023"] },
        { title: "Define: Cyst", years: ["2018", "2020", "2022"] },
        { title: "Define: Oocyst", years: ["2017", "2021"] },
        { title: "Define: Schizont", years: ["2019", "2022", "2023"] },
        { title: "Define: Gametocyte", years: ["2018", "2021"] },
        { title: "Define: Vector", years: ["2020", "2022"] },
        { title: "Define: Definitive host", years: ["2017", "2021", "2023"] },
        { title: "Define: Intermediate host", years: ["2019", "2023"] }
      ]
    },
    "Clinical Microbiology": {
      10: [
        { title: "Describe the collection, transport, and processing of various clinical specimens for microbiological examination.", years: ["2017", "2019", "2021", "2023"] },
        { title: "Describe the methods of antimicrobial susceptibility testing and interpretation of results.", years: ["2018", "2020", "2022"] },
        { title: "Describe the laboratory diagnosis of central nervous system infections.", years: ["2019", "2021", "2023"] },
        { title: "Describe the laboratory diagnosis of respiratory tract infections.", years: ["2017", "2020", "2022"] }
      ],
      5: [
        { title: "Write short notes on: Blood culture collection", years: ["2019", "2021", "2023"] },
        { title: "Write short notes on: CSF examination", years: ["2018", "2020", "2022"] },
        { title: "Write short notes on: Urine culture", years: ["2017", "2021"] },
        { title: "Write short notes on: Sputum culture", years: ["2019", "2022", "2023"] },
        { title: "Write short notes on: Kirby-Bauer method", years: ["2018", "2021"] },
        { title: "Write short notes on: MIC determination", years: ["2020", "2022"] },
        { title: "Write short notes on: Healthcare associated infections", years: ["2017", "2021", "2023"] },
        { title: "Write short notes on: Hand hygiene in healthcare", years: ["2019", "2022"] }
      ],
      2: [
        { title: "Define: Colony forming units", years: ["2019", "2021", "2023"] },
        { title: "Define: Zone of inhibition", years: ["2018", "2020", "2022"] },
        { title: "Define: Breakpoints in AST", years: ["2017", "2021"] },
        { title: "Define: MIC", years: ["2019", "2022", "2023"] },
        { title: "Define: Bacteremia", years: ["2018", "2021"] },
        { title: "Define: Septicemia", years: ["2020", "2022"] },
        { title: "Define: Biomedical waste", years: ["2017", "2021", "2023"] },
        { title: "Define: Biosafety levels", years: ["2019", "2023"] }
      ]
    }
  }
};

async function main() {
  console.log('Starting database seed...');
  
  // Check if data already exists
  const existingSubjects = await prisma.subject.count();
  if (existingSubjects > 0) {
    console.log(`Database already has ${existingSubjects} subjects. Skipping seed.`);
    console.log('To re-seed, run: bun prisma/seed.ts --force');
    return;
  }
  
  console.log('Seeding fresh database...');
  
  let totalQuestions = 0;
  
  for (const [subjectName, subjectInfo] of Object.entries(subjectData)) {
    // Create Subject
    const subject = await prisma.subject.create({
      data: {
        name: subjectName,
        description: subjectInfo.description
      }
    });
    console.log(`Created subject: ${subjectName}`);
    
    for (const systemInfo of subjectInfo.systems) {
      // Create System
      const system = await prisma.system.create({
        data: {
          name: systemInfo.name,
          description: systemInfo.description,
          subjectId: subject.id
        }
      });
      console.log(`  Created system: ${systemInfo.name}`);
      
      for (const marksInfo of systemInfo.marks) {
        // Create Marks
        const marks = await prisma.marks.create({
          data: {
            value: marksInfo.value,
            description: marksInfo.description,
            systemId: system.id
          }
        });
        
        // Get questions for this subject, system, and marks value
        const subjectQuestions = questionsData[subjectName];
        if (subjectQuestions && subjectQuestions[systemInfo.name]) {
          const questionsForMarks = subjectQuestions[systemInfo.name][marksInfo.value] || [];
          
          for (const q of questionsForMarks) {
            const yearsStr = q.years ? q.years.join(',') : '';
            const repeatCount = q.years ? q.years.length : 1;
            const lastYear = q.years && q.years.length > 0 ? parseInt(q.years[q.years.length - 1]) : null;
            
            await prisma.question.create({
              data: {
                title: q.title,
                content: q.content || null,
                repeatCount: repeatCount,
                yearsAppeared: yearsStr,
                lastAppearedYear: lastYear,
                globalImportance: Math.min(50 + (repeatCount * 10), 100), // Higher importance for repeated questions
                calculatedScore: Math.min(40 + (repeatCount * 15), 100), // Calculate initial score
                marksId: marks.id
              }
            });
            totalQuestions++;
          }
          console.log(`    Created ${questionsForMarks.length} questions for ${marksInfo.value} marks`);
        }
      }
    }
  }
  
  console.log(`\nSeeding completed!`);
  console.log(`Total subjects: ${Object.keys(subjectData).length}`);
  console.log(`Total questions: ${totalQuestions}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
