export interface Criteria {
  id: string;
  title: string;
  description: string;
  questionIds: string[];
  roleSpecific?: "petani" | "manajer";
  stageSpecific?: 1 | 2 | 3;
  displayId?: string;
  displayTitle?: string;
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
        roleSpecific: "petani",
        stageSpecific: 1,
      },
      {
        id: "criteria_1_1",
        title: "Kriteria 1.1",
        description:
          "Pendirian badan hukum bagi manajer untuk bisa mengikuti standar RSPO",
        questionIds: ["q1", "q2", "q3", "q4"],
        roleSpecific: "manajer",
        stageSpecific: 1,
      },
      {
        id: "criteria_1_2",
        title: "Kriteria 1.2",
        description: "Petani mengimplementasikan GAP di kebun mereka",
        questionIds: ["q5", "q6"],
        stageSpecific: 1,
      },
      {
        id: "criteria_1_3",
        title: "Kriteria 1.1",
        description:
          "Pendirian badan hukum bagi petani untuk bisa mengikuti standar RSPO",
        questionIds: ["q200_1", "q_200_2", "q200_3"],
        stageSpecific: 2,
      },
      {
        id: "criteria_1_3",
        title: "Kriteria 1.1",
        description:
          "Pendirian badan hukum bagi petani untuk bisa mengikuti standar RSPO",
        questionIds: ["q200_4", "q200_5", "q200_6"],
        roleSpecific: "manajer",
        stageSpecific: 2,
      },
      {
        id: "criteria_1_4",
        title: "Kriteria 1.2",
        description: "Petani memiliki kemampuan mengelola kebun secara efektif",
        questionIds: ["q200_7", "q200_8"],
        roleSpecific: "manajer",
        stageSpecific: 2,
      },
      {
        id: "criteria_1_5",
        title: "Kriteria 1.3",
        description: "Petani mengimplementasikan GAP di kebun mereka",
        questionIds: ["q200_9"],
        roleSpecific: "manajer",
        stageSpecific: 2,
      },
      {
        id: "criteria_1_6",
        title: "Kriteria 1.1",
        description:
          "Pendirian badan hukum bagi petani untuk bisa mengikuti standar RSPO",
        questionIds: ["q300_1", "q300_2"],
        stageSpecific: 3,
      },
      {
        id: "criteria_1_7",
        title: "Kriteria 1.2",
        description: "Petani memiliki kemampuan mengelola kebun secara efektif",
        questionIds: ["q300_3", "q300_4", "q300_5"],
        stageSpecific: 3,
      },
      {
        id: "criteria_1_8",
        title: "Kriteria 1.3",
        description: "Petani mengimplementasikan GAP di kebun mereka",
        questionIds: ["q300_6", "q300_7"],
        stageSpecific: 3,
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
        stageSpecific: 1,
      },
      {
        id: "criteria_2_2",
        title: "Kriteria 2.2",
        description:
          "Petani tidak memperoleh lahan dari masyarakat adat, komunitas lokal, atau pihak lain tanpa persetujuan bebas mereka (FPIC).",
        questionIds: ["q8", "q9"],
        stageSpecific: 1,
      },
      {
        id: "criteria_2_3",
        title: "Kriteria 2.3",
        description:
          "Hak untuk menggunakan lahan tidak sedang disengketakan oleh masyarakat adat, komunitas lokal, atau pihak lain.",
        questionIds: ["q10"],
        stageSpecific: 1,
      },
      {
        id: "criteria_2_4",
        title: "Kriteria 2.4",
        description:
          "Kebun petani berada di luar kawasan taman nasional atau kawasan lindung yang ditetapkan oleh hukum nasional, daerah, atau interpretasi nasional.",
        questionIds: ["q11", "q12"],
        stageSpecific: 1,
      },
      {
        id: "criteria_2_5",
        title: "Kriteria 2.5",
        description:
          "Jika ada rencana pembukaan kebun baru, petani tidak membuka atau memperoleh lahan tanpa persetujuan bebas dari masyarakat terdampak, berdasarkan pendekatan FPIC yang disederhanakan.",
        questionIds: ["q13"],
        stageSpecific: 1,
      },
      {
        id: "criteria_2_6",
        title: "Kriteria 2.1",
        description:
          "Petani memiliki hak legal atau hak adat untuk menggunakan lahan sesuai hukum nasional dan lokal.",
        questionIds: ["q200_10", "q200_11"],
        stageSpecific: 2,
      },
      {
        id: "criteria_2_7",
        title: "Kriteria 2.2",
        description:
          "Petani tidak memperoleh lahan dari masyarakat adat, komunitas lokal, atau pihak lain tanpa persetujuan bebas mereka (FPIC).",
        questionIds: ["q200_12", "q200_13", "q200_14"],
        stageSpecific: 2,
      },
      {
        id: "criteria_2_8",
        title: "Kriteria 2.3",
        description:
          "Hak untuk menggunakan lahan tidak sedang disengketakan oleh masyarakat adat, komunitas lokal, atau pihak lain.",
        questionIds: ["q200_15"],
        stageSpecific: 2,
      },
      {
        id: "criteria_2_9",
        title: "Kriteria 2.4",
        description:
          "Jika ada rencana pembukaan kebun baru, petani tidak membuka atau memperoleh lahan tanpa persetujuan bebas dari masyarakat terdampak, berdasarkan pendekatan FPIC yang disederhanakan.",
        questionIds: ["q200_16"],
        stageSpecific: 2,
      },
      {
        id: "criteria_2_10",
        title: "Kriteria 2.1",
        description:
          "Petani memiliki hak legal atau hak adat untuk menggunakan lahan sesuai hukum nasional dan lokal.",
        questionIds: ["q300_8"],
        stageSpecific: 3,
      },
      {
        id: "criteria_2_11",
        title: "Kriteria 2.5",
        description:
          "Jika ada rencana pembukaan kebun baru, petani tidak membuka atau memperoleh lahan tanpa persetujuan bebas dari masyarakat terdampak, berdasarkan pendekatan FPIC yang disederhanakan.",
        questionIds: ["q300_9, q300_10", "q300_11"],
        stageSpecific: 3,
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
        stageSpecific: 1,
      },
      {
        id: "criteria_3_2",
        title: "Kriteria 3.2",
        description: "Anak tidak dipekerjakan atau dieksploitasi",
        questionIds: ["q15"],
        stageSpecific: 1,
      },
      {
        id: "criteria_3_3",
        title: "Kriteria 3.3",
        description: "Pembayaran pekerja sesuai hukum dan standar minimum",
        questionIds: ["q16"],
        stageSpecific: 1,
      },
      {
        id: "criteria_3_4",
        title: "Kriteria 3.4",
        description: "Pekerja memahami hak untuk menyampaikan keluhan",
        questionIds: ["q17"],
        stageSpecific: 1,
      },
      {
        id: "criteria_3_5",
        title: "Kriteria 3.5",
        description: "Kondisi kerja yang aman dan layak",
        questionIds: ["q18"],
        stageSpecific: 1,
      },
      {
        id: "criteria_3_6",
        title: "Kriteria 3.6",
        description: "Tidak ada diskriminasi atau kekerasan",
        questionIds: ["q19", "q20"],
        stageSpecific: 1,
      },
      {
        id: "criteria_3_7",
        title: "Kriteria 3.1",
        description: "Tidak ada kerja paksa di kebun",
        questionIds: [
          "q200_17",
          "q200_18",
          "q200_19",
          "q200_20",
          "q200_21",
          "q200_22",
          "q200_23",
          "q200_24",
          "q200_25",
          "q200_26",
        ],
        stageSpecific: 2,
      },
      {
        id: "criteria_3_8",
        title: "Kriteria 3.2",
        description: "Anak tidak dipekerjakan atau dieksploitasi",
        questionIds: ["q200_27", "q200_28", "q200_29", "q200_30"],
        stageSpecific: 2,
      },
      {
        id: "criteria_3_9",
        title: "Kriteria 3.3",
        description: "Pembayaran pekerja sesuai hukum dan standar minimum",
        questionIds: ["q200_31", "q200_32"],
        stageSpecific: 2,
      },
      {
        id: "criteria_3_10",
        title: "Kriteria 3.4",
        description: "Pekerja memahami hak untuk menyampaikan keluhan",
        questionIds: ["q200_33", "q200_34"],
        stageSpecific: 2,
      },
      {
        id: "criteria_3_11",
        title: "Kriteria 3.5",
        description: "Kondisi kerja yang aman dan layak",
        questionIds: ["q200_35", "q200_36", "q200_37", "q200_38"],
        stageSpecific: 2,
      },
      {
        id: "criteria_3_12",
        title: "Kriteria 3.6",
        description: "Tidak ada diskriminasi atau kekerasan",
        questionIds: ["q200_39", "q200_40", "q200_41"],
        stageSpecific: 2,
      },
      {
        id: "criteria_3_13",
        title: "Kriteria 3.1",
        description: "Tidak ada kerja paksa di kebun",
        questionIds: ["q300_12", "q300_13", "q300_14"],
        stageSpecific: 3,
      },
      {
        id: "criteria_3_14",
        title: "Kriteria 3.3",
        description: "Pembayaran pekerja sesuai hukum dan standar minimum",
        questionIds: ["q300_15", "q300_16", "q300_17"],
        stageSpecific: 3,
      },
      {
        id: "criteria_3_15",
        title: "Kriteria 3.4",
        description: "Pekerja memahami hak untuk menyampaikan keluhan",
        questionIds: ["q300_18", "q300_19"],
        stageSpecific: 3,
      },
      {
        id: "criteria_3_16",
        title: "Kriteria 3.5",
        description: "Kondisi kerja yang aman dan layak",
        questionIds: [
          "q300_20",
          "q300_21",
          "q300_22",
          "q300_23",
          "q300_24",
          "q300_25",
          "q300_26",
          "q300_27",
          "q300_28",
        ],
        stageSpecific: 3,
      },
      {
        id: "criteria_3_17",
        title: "Kriteria 3.6",
        description: "Tidak ada diskriminasi atau kekerasan",
        questionIds: ["q300_29", "q300_30"],
        stageSpecific: 3,
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
        stageSpecific: 1,
      },
      {
        id: "criteria_4_2",
        title: "Kriteria 4.2",
        description: "Lahan yang dibuka setelah 2005 perlu proses remediasi",
        questionIds: ["q22"],
        stageSpecific: 1,
      },
      {
        id: "criteria_4_3",
        title: "Kriteria 4.3",
        description:
          "Penanaman baru setelah 2019 tidak boleh di lahan sensitif",
        questionIds: ["q23"],
        stageSpecific: 1,
      },
      {
        id: "criteria_4_4",
        title: "Kriteria 4.4",
        description: "Pengelolaan Gambut yang ada",
        questionIds: ["q24"],
        stageSpecific: 1,
      },
      {
        id: "criteria_4_5",
        title: "Kriteria 4.5",
        description: "Rencana penanaman ulang di gambut",
        questionIds: ["q25"],
        stageSpecific: 1,
      },
      {
        id: "criteria_4_6",
        title: "Kriteria 4.6",
        description: "Tidak menggunakan Api",
        questionIds: ["q26"],
        stageSpecific: 1,
      },
      {
        id: "criteria_4_7",
        title: "Kriteria 4.7",
        description: "Pengelolaan sempadan sungai",
        questionIds: ["q27"],
        stageSpecific: 1,
      },
      {
        id: "criteria_4_8",
        title: "Kriteria 4.8",
        description: "Pestisida berbahaya dilarang",
        questionIds: ["q28"],
        stageSpecific: 1,
      },
      {
        id: "criteria_4_3",
        title: "Kriteria 4.3",
        description: "Rencana penanaman baru",
        questionIds: ["q29"],
        stageSpecific: 1,
      },
      {
        id: "criteria_4_4",
        title: "Kriteria 4.4",
        description: "Pengelolaan gambut",
        questionIds: ["q30"],
        stageSpecific: 1,
      },
      {
        id: "criteria_4_6",
        title: "Kriteria 4.6",
        description: "Larangan penggunaan api",
        questionIds: ["q31"],
        stageSpecific: 1,
      },
      {
        id: "criteria_4_8",
        title: "Kriteria 4.8",
        description: "Penggunaan pestisida berbahaya",
        questionIds: ["q32"],
        stageSpecific: 1,
      },
      {
        id: "criteria_4_9",
        title: "Kriteria 4.1",
        description:
          "Nilai Konservasi Tinggi (HCV) dan Hutan Stok Karbon Tinggi (HCS) dilindungi",
        questionIds: ["q200_42", "q200_43", "q200_44", "q200_45", "q200_46"],
        stageSpecific: 2,
      },
      {
        id: "criteria_4_10",
        title: "Kriteria 4.2",
        description: "Lahan yang dibuka setelah 2005 perlu proses remediasi",
        questionIds: [
          "q200_47",
          "q200_48",
          "q200_49",
          "q200_50",
          "q200_51",
          "q200_52",
        ],
        stageSpecific: 2,
      },
      {
        id: "criteria_4_10",
        title: "Kriteria 4.3",
        description:
          "Penanaman baru setelah 2019 tidak boleh di lahan sensitif",
        questionIds: [
          "q200_53",
          "q200_54",
          "q200_55",
          "q200_56",
          "q200_57",
          "q200_58",
        ],
        stageSpecific: 2,
      },
      {
        id: "criteria_4_11",
        title: "Kriteria 4.4",
        description: "Pengelolaan Gambut yang ada",
        questionIds: ["q200_59", "q200_60", "q200_61", "q200_62"],
        stageSpecific: 2,
      },
      {
        id: "criteria_4_12",
        title: "Kriteria 4.5",
        description: "Rencana penanaman ulang di gambut",
        questionIds: ["q200_63", "q200_64", "q200_65", "q200_66", "q200_67"],
        stageSpecific: 2,
      },
      {
        id: "criteria_4_13",
        title: "Kriteria 4.6",
        description: "Tidak menggunakan Api",
        questionIds: ["q200_68", "q200_69", "q200_70", "q200_71", "q200_72"],
        stageSpecific: 2,
      },
      {
        id: "criteria_4_14",
        title: "Kriteria 4.7",
        description: "Pengelolaan sempadan sungai",
        questionIds: ["q200_73", "q200_74", "q200_75", "q200_76"],
        stageSpecific: 2,
      },
      {
        id: "criteria_4_14",
        title: "Kriteria 4.8",
        description: "Pestisida berbahaya dilarang",
        questionIds: ["q200_77", "q200_78", "q200_79", "q200_80", "q200_81"],
        stageSpecific: 2,
      },
      {
        id: "criteria_4_15",
        title: "Kriteria 4.9",
        description:
          "Kelompok dan Petani mengendalikan hama, penyakit, gulma, dan tanaman asing yang mengganggu dengan cara yang tepat, termasuk (tapi tidak tebatas pada) cara ramah lingkungan seperti Pengendalian Hama Terpadu (PHT/IPM)",
        questionIds: ["q200_82", "q200_83", "q200_84", "q200_85"],
        stageSpecific: 2,
      },
      {
        id: "criteria_4_16",
        title: "Kriteria 4.1",
        description:
          "Nilai Konservasi Tinggi (HCV) dan Hutan Stok Karbon Tinggi (HCS) dilindungi",
        questionIds: [
          "q300_31",
          "q300_32",
          "q300_33",
          "q300_34",
          "q300_35",
          "q300_36",
          "q300_37",
        ],
        stageSpecific: 3,
      },
      {
        id: "criteria_4_17",
        title: "Kriteria 4.2",
        description: "Lahan yang dibuka setelah 2005 perlu proses remediasi",
        questionIds: ["q300_38", "q300_39"],
        stageSpecific: 3,
      },
      {
        id: "criteria_4_18",
        title: "Kriteria 4.3",
        description:
          "Penanaman baru setelah 2019 tidak boleh di lahan sensitif",
        questionIds: ["q300_40", "q300_41", "q300_42", "q300_43", "q300_44"],
        stageSpecific: 3,
      },
      {
        id: "criteria_4_19",
        title: "Kriteria 4.4",
        description: "Pengelolaan Gambut yang ada",
        questionIds: ["q300_45", "q300_46", "q300_47", "q300_48"],
        stageSpecific: 3,
      },
      {
        id: "criteria_4_20",
        title: "Kriteria 4.5",
        description: "Rencana penanaman ulang di gambut",
        questionIds: ["q300_49", "q300_50", "q300_51", "q300_52"],
        stageSpecific: 3,
      },
      {
        id: "criteria_4_21",
        title: "Kriteria 4.6",
        description: "Tidak menggunakan Api",
        questionIds: ["q300_53", "q300_54", "q300_55"],
        stageSpecific: 3,
      },
      {
        id: "criteria_4_22",
        title: "Kriteria 4.7",
        description: "Pengelolaan sempadan sungai",
        questionIds: ["q300_56", "q300_57", "q300_58", "q300_59", "q300_60"],
        stageSpecific: 3,
      },
      {
        id: "criteria_4_24",
        title: "Kriteria 4.8",
        description: "Pestisida berbahaya dilarang",
        questionIds: ["q300_61", "q300_62", "q300_63", "q300_64"],
        stageSpecific: 3,
      },
      {
        id: "criteria_4_17",
        title: "Kriteria 4.9",
        description:
          "Kelompok dan Petani mengendalikan hama, penyakit, gulma, dan tanaman asing yang mengganggu dengan cara yang tepat, termasuk (tapi tidak tebatas pada) cara ramah lingkungan seperti Pengendalian Hama Terpadu (PHT/IPM)",
        questionIds: ["q300_65", "q300_66", "q300_67", "q300_68"],
        stageSpecific: 3,
      },
    ],
  },
];

export const getQuestionPrincipleCriteria = (
  questionId: string,
  opts?: { role?: "petani" | "manajer"; stage?: 1 | 2 | 3 }
) => {
  for (const principle of principlesCriteria) {
    const matching = principle.criteria.filter((criteria) =>
      criteria.questionIds.includes(questionId)
    );

    if (matching.length > 0) {
      // Prefer the most specific match: role + stage > role-only > stage-only > generic
      let selected: Criteria | undefined;

      if (opts?.role && opts?.stage) {
        selected = matching.find(
          (c) => c.roleSpecific === opts.role && c.stageSpecific === opts.stage
        );
      }

      if (!selected && opts?.role) {
        selected = matching.find((c) => c.roleSpecific === opts.role);
      }

      if (!selected && opts?.stage) {
        selected = matching.find((c) => c.stageSpecific === opts.stage);
      }

      if (!selected) {
        selected = matching[0];
      }

      // Compute display title for milestones (A/B) to make titles differ by stage as required
      if (opts?.stage && (opts.stage === 2 || opts.stage === 3)) {
        selected = {
          ...selected,
          displayTitle:
            selected.title +
            (opts.stage === 2 ? " – Milestone A" : " – Milestone B"),
        };
      }

      return {
        principle,
        criteria: selected,
      };
    }
  }

  // Fallback for Milestone A/B when there is no explicit mapping
  if (opts?.stage && (opts.stage === 2 || opts.stage === 3)) {
    const principle =
      principlesCriteria.find((p) => p.id === "principle_1") ||
      principlesCriteria[0];

    const criteria: Criteria = {
      id: "criteria_1_1",
      title: "Kriteria 1.1",
      description:
        opts?.role === "manajer"
          ? "Kriteria khusus Milestone untuk manajer"
          : "Kriteria khusus Milestone untuk petani",
      questionIds: [questionId],
      roleSpecific: opts?.role,
      stageSpecific: opts.stage,
      displayTitle: `Kriteria 1.1 ${
        opts.stage === 2 ? "– Milestone A" : "– Milestone B"
      }`,
    };

    return { principle, criteria };
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
