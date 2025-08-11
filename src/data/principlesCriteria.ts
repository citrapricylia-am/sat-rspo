export interface Criteria {
  id: string;
  title: string;
  description: string;
  questionIds: string[];
}

export interface Principle {
  id: string;
  title: string;
  description: string;
  criteria: Criteria[];
}

export const principlesCriteria: Principle[] = [
  {
    id: "principle_1",
    title: "Prinsip 1",
    description:
      "Petani memiliki kapasitas organisasi dan pertanian untuk memenuhi standar RSPO",
    criteria: [
      {
        id: "criteria_1_1",
        title: "Kriteria 1.1",
        description:
          "Pendirian badan hukum bagi petani untuk bisa mengikuti standar RSPO",
        questionIds: ["q1", "q2", "q3", "q4"],
      },
      {
        id: "criteria_1_2",
        title: "Kriteria 1.2",
        description: "Petani mengimplementasikan GAP di kebun mereka",
        questionIds: ["q5", "q6"],
      },
    ],
  },
  {
    id: "principle_2",
    title: "Prinsip 2",
    description:
      "Petani memiliki hak yang sah dan jelas atas tanah yang mereka kelola",
    criteria: [
      {
        id: "criteria_2_1",
        title: "Kriteria 2.1",
        description:
          "Petani memiliki hak legal atau hak adat untuk menggunakan lahan sesuai hukum nasional dan lokal.",
        questionIds: ["q7"],
      },
      {
        id: "criteria_2_2",
        title: "Kriteria 2.2",
        description:
          "Petani tidak memperoleh lahan dari masyarakat adat, komunitas lokal, atau pihak lain tanpa persetujuan bebas mereka (FPIC).",
        questionIds: ["q8", "q9"],
      },
      {
        id: "criteria_2_3",
        title: "Kriteria 2.3",
        description:
          "Hak untuk menggunakan lahan tidak sedang disengketakan oleh masyarakat adat, komunitas lokal, atau pihak lain.",
        questionIds: ["q10"],
      },
      {
        id: "criteria_2_4",
        title: "Kriteria 2.4",
        description:
          "Kebun petani berada di luar kawasan taman nasional atau kawasan lindung yang ditetapkan oleh hukum nasional, daerah, atau interpretasi nasional.",
        questionIds: ["q11", "q12"],
      },
      {
        id: "criteria_2_5",
        title: "Kriteria 2.5",
        description:
          "Jika ada rencana pembukaan kebun baru, petani tidak membuka atau memperoleh lahan tanpa persetujuan bebas dari masyarakat terdampak, berdasarkan pendekatan FPIC yang disederhanakan.",
        questionIds: ["q13"],
      },
    ],
  },
  {
    id: "principle_3",
    title: "Prinsip 3",
    description: "Petani menghormati hak-hak pekerja",
    criteria: [
      {
        id: "criteria_3_1",
        title: "Kriteria 3.1",
        description: "Tidak ada kerja paksa di kebun",
        questionIds: ["q14"],
      },
      {
        id: "criteria_3_2",
        title: "Kriteria 3.2",
        description: "Anak tidak dipekerjakan atau dieksploitasi",
        questionIds: ["q15"],
      },
      {
        id: "criteria_3_3",
        title: "Kriteria 3.3",
        description: "Pembayaran pekerja sesuai hukum dan standar minimum",
        questionIds: ["q16"],
      },
      {
        id: "criteria_3_4",
        title: "Kriteria 3.4",
        description: "Pekerja memahami hak untuk menyampaikan keluhan",
        questionIds: ["q17"],
      },
      {
        id: "criteria_3_5",
        title: "Kriteria 3.5",
        description: "Kondisi kerja yang aman dan layak",
        questionIds: ["q18"],
      },
      {
        id: "criteria_3_6",
        title: "Kriteria 3.6",
        description: "Tidak ada diskriminasi atau kekerasan",
        questionIds: ["q19", "q20"],
      },
    ],
  },
  {
    id: "principle_4",
    title: "Prinsip 4",
    description:
      "Petani mengelola lahan dan perkebunan secara ramah lingkungan",
    criteria: [
      {
        id: "criteria_4_1",
        title: "Kriteria 4.1",
        description:
          "Nilai Konservasi Tinggi (HCV) dan Hutan Stok Karbon Tinggi (HCS) dilindungi",
        questionIds: ["q21"],
      },
      {
        id: "criteria_4_2",
        title: "Kriteria 4.2",
        description: "Lahan yang dibuka setelah 2005 perlu proses remediasi",
        questionIds: ["q22"],
      },
      {
        id: "criteria_4_3",
        title: "Kriteria 4.3",
        description:
          "Penanaman baru setelah 2019 tidak boleh di lahan sensitif",
        questionIds: ["q23"],
      },
      {
        id: "criteria_4_4",
        title: "Kriteria 4.4",
        description: "Pengelolaan Gambut yang ada",
        questionIds: ["q24"],
      },
      {
        id: "criteria_4_5",
        title: "Kriteria 4.5",
        description: "Rencana penanaman ulang di gambut",
        questionIds: ["q25"],
      },
      {
        id: "criteria_4_6",
        title: "Kriteria 4.6",
        description: "Tidak menggunakan Api",
        questionIds: ["q26"],
      },
      {
        id: "criteria_4_7",
        title: "Kriteria 4.7",
        description: "Pengelolaan sempadan sungai",
        questionIds: ["q27"],
      },
      {
        id: "criteria_4_8",
        title: "Kriteria 4.8",
        description: "Pestisida berbahaya dilarang",
        questionIds: ["q28"],
      },
      {
        id: "criteria_4_3",
        title: "Kriteria 4.3",
        description: "Rencana penanaman baru",
        questionIds: ["q29"],
      },
      {
        id: "criteria_4_4",
        title: "Kriteria 4.4",
        description: "Pengelolaan gambut",
        questionIds: ["q30"],
      },
      {
        id: "criteria_4_6",
        title: "Kriteria 4.6",
        description: "Larangan penggunaan api",
        questionIds: ["q31"],
      },
      {
        id: "criteria_4_8",
        title: "Kriteria 4.8",
        description: "Penggunaan pestisida berbahaya",
        questionIds: ["q32"],
      },
    ],
  },
];

export const getQuestionPrincipleCriteria = (questionId: string) => {
  for (const principle of principlesCriteria) {
    for (const criteria of principle.criteria) {
      if (criteria.questionIds.includes(questionId)) {
        return {
          principle,
          criteria,
        };
      }
    }
  }
  return null;
};

export const getAllQuestionsGrouped = () => {
  return principlesCriteria.map((principle) => ({
    ...principle,
    criteria: principle.criteria.map((criteria) => ({
      ...criteria,
      questions: criteria.questionIds,
    })),
  }));
};
