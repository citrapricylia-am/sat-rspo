export interface SubQuestion {
  id: string;
  text: string;
  options: Array<{
    value: string;
    label: string;
    score: number;
  }>;
  triggerValue?: string; // the value that triggers this sub-question
}

export interface Question {
  id: string;
  text: string;
  options: Array<{
    value: string;
    label: string;
    score: number;
  }>;
  subQuestions?: SubQuestion[];
  triggerSubQuestions?: string; // legacy - for backward compatibility
  roleSpecific?: "petani" | "manajer";
  dependsOn?: {
    questionId: string;
    requiredValue: string;
  };
}

export const stage1Questions: Question[] = [
  {
    id: "q1",
    text: "1. Apakah Bapak/Ibu saat ini tergabung dalam kelompok petani yang sudah terdaftar secara hukum, atau sedang dalam proses bergabung?",
    options: [
      { value: "ya", label: "Ya, Sudah Terdaftar", score: 2 },
      { value: "proses", label: "Sedang Proses Bergabung", score: 1 },
      { value: "tidak", label: "Tidak Terdaftar", score: 0 },
    ],
  },
  {
    id: "q2",
    text: "2. Jika Bapak/Ibu tergabung dalam kelompok, apakah pengambilan keputusan di kelompok dilakukan secara adil dan terbuka? Jika belum tergabung, apakah Bapak/Ibu memahami pentingnya sistem seperti itu?",
    options: [
      { value: "keputusan", label: "Ya, Pengambilan Keputusan Adil", score: 2 },
      { value: "sistem", label: "Sedang Proses Membangun Sistem", score: 1 },
      {
        value: "tidak_memahami",
        label: "Tidak Memahami Pentingnya Sistem",
        score: 0,
      },
    ],
  },
  {
    id: "q3",
    text: "3. Apakah kelompok (jika sudah ada) memiliki dokumen tambahan sesuai aturan negara? Jika belum tergabung, apakah Bapak/Ibu mengetahui bahwa hal ini akan dibutuhkan saat proses sertifikasi?",
    options: [
      { value: "memlikidokumentambahan", label: "Ya, Memiliki Dokumen Tambahan", score: 2 },
      { value: "prosesmemperoleh dokumen", label: "Sedang Proses Memperoleh Dokumen", score: 1 },
      { value: "tidakmemilikidokumen", label: "Tidak Memiliki Dokumen Tambahan", score: 0 },
    ],
  },
  {
    id: "q4",
    text: "4. Apakah Bapak/Ibu sudah menandatangani pernyataan komitmen sebagai petani sawit berkelanjutan (Smallholder Declaration)?",
    options: [
      { value: "menandatangani", label: "Ya, Sudah Menandatangani", score: 2 },
      { value: "prosesmenandatangani", label: "Sedang Proses Menandatangani", score: 1 },
      { value: "tidakmenandatangani", label: "Tidak Menandatangani", score: 0 },
    ],
  },
  {
    id: "q5",
    text: "5. Apakah Bapak/Ibu bersedia menerapkan praktik pertanian yang baik di kebun sendiri sesuai prinsip RSPO?",
    options: [
      { value: "bersedia", label: "Ya, Bersedia Menerapkan Praktik Baik", score: 2 },
      {
        value: "prosesmenerapkan",
        label: "Sedang Proses Menerapkan Praktik Baik",
        score: 1,
      },
      {
        value: "tidakbersedia",
        label: "Tidak Bersedia Menerapkan Praktik Baik",
        score: 0,
      },
    ],
  },
  {
    id: "q6",
    text: "6. Apakah Bapak/Ibu berkomitmen menerapkan praktik pertanian yang baik (GAP) di kebun?",
    options: [
      { value: "yaberkomitmen", label: "Ya, Berkomitmen Menerapkan GAP", score: 2 },
      { value: "prosesmenerapkan", label: "Sedang Proses Menerapkan GAP", score: 1 },
      { value: "tidakmenerapkan", label: "Tidak Berkomitmen Menerapkan GAP", score: 0 },
    ],
  },
  {
    id: "q7",
    text: "7. Apakah Bapak/Ibu memiliki peta atau titik koordinat kebun, dan dapat menunjukkan bukti hak atas lahan tersebut (misalnya surat, warisan, hak adat)?",
    options: [
      { value: "bukti", label: "Ya, Memiliki Peta dan Bukti Hak Lahan", score: 2 },
      {
        value: "prosesmemperoleh",
        label: "Sedang Proses Memperoleh Peta dan Bukti Hak Lahan",
        score: 1,
      },
      {
        value: "tidakbukti",
        label: "Tidak Memiliki Peta atau Bukti Hak Lahan",
        score: 0,
      },
    ],
    triggerSubQuestions: "tidak",
    subQuestions: [
      {
        id: "q7_sub1",
        text: "7a. Jika belum memiliki dokumen, apakah Bapak/Ibu sedang dalam proses pengurusan legalisasi hak atas lahan tersebut?",
        options: [
          { value: "yalegalisasi", label: "Ya, Sedang Proses Legalisasi", score: 2 },
          { value: "proseslegalisasi", label: "Sedang Proses Legalisasi", score: 1 },
          { value: "tidaklegalisasi", label: "Tidak Sedang Proses Legalisasi", score: 0 },
        ],
      },
    ],
  },
  {
    id: "q8",
    text: "8. Apakah lahan yang Bapak/Ibu miliki tidak berasal dari pengambilalihan milik masyarakat adat, komunitas lokal, atau pengguna lain?",
    options: [
      { value: "ya", label: "Ya, Mengambil Alih Lahan Masyarakat", score: 2 },
      {
        value: "proses",
        label: "Sedang Proses Mendapatkan Persetujuan Masyarakat",
        score: 1,
      },
      {
        value: "tidak",
        label: "Tidak Mengambil Alih Lahan Masyarakat",
        score: 0,
      },
    ],
    triggerSubQuestions: "ya",
    subQuestions: [
      {
        id: "q8_sub1",
        text: "8a. Jika pernah mengambil lahan dari orang lain, apakah hal itu dilakukan dengan persetujuan dan tanpa paksaan?",
        options: [
          {
            value: "ya",
            label: "Ya, Mendapatkan Persetujuan Masyarakat",
            score: 2,
          },
          {
            value: "proses",
            label: "Sedang Proses Mendapatkan Persetujuan",
            score: 1,
          },
          {
            value: "tidak",
            label: "Tidak Mendapatkan Persetujuan Masyarakat",
            score: 0,
          },
        ],
      },
    ],
  },
  {
    id: "q9",
    text: "9. Apakah Bapak/Ibu mengetahui apa itu persetujuan bebas, didahului, dan diinformasikan (FPIC)?",
    options: [
      { value: "ya", label: "Ya, Mengetahui FPIC", score: 2 },
      { value: "proses", label: "Sedang Proses Memahami FPIC", score: 1 },
      { value: "tidak", label: "Tidak Mengetahui FPIC", score: 0 },
    ],
  },
  {
    id: "q10",
    text: "10. Apakah kebun Bapak/Ibu sedang dalam sengketa atau konflik dengan masyarakat lain?",
    options: [
      { value: "ya", label: "Ya, Sedang Dalam Sengketa", score: 2 },
      {
        value: "proses",
        label: "Sedang Proses Penyelesaian Sengketa",
        score: 1,
      },
      { value: "tidak", label: "Tidak Ada Sengketa", score: 0 },
    ],
    subQuestions: [
      {
        id: "q10_sub1",
        text: "10a. Jika ya, apakah Bapak/Ibu bersedia untuk menyelesaikannya melalui cara yang adil dan disepakati semua pihak?",
        triggerValue: "ya",
        options: [
          {
            value: "bersedia",
            label: "Ya, Bersedia Menyelesaikan Sengketa Secara Adil",
            score: 2,
          },
          {
            value: "sedang",
            label: "Sedang Proses Penyelesaian Sengketa",
            score: 1,
          },
          {
            value: "belum",
            label: "Belum Bersedia Menyelesaikan Sengketa",
            score: 0,
          },
        ],
      },
      {
        id: "q10_sub2",
        text: "10b. Jika tidak ada sengketa, apakah Bapak/Ibu memiliki bukti atau kesaksian bahwa lahan tersebut diterima oleh masyarakat sekitar?",
        triggerValue: "tidak",
        options: [
          { value: "ya", label: "Ya, Memiliki Catatan atau Bukti", score: 2 },
          {
            value: "proses",
            label: "Sedang Proses Mengumpulkan Bukti",
            score: 1,
          },
          {
            value: "tidak",
            label: "Tidak Memiliki Catatan atau Bukti",
            score: 0,
          },
        ],
      },
    ],
  },
  {
    id: "q11",
    text: "11. Apakah kebun Bapak/Ibu tidak berada di kawasan taman nasional, hutan lindung, atau kawasan konservasi lain?",
    options: [
      { value: "ya", label: "Ya, Berada Di Kawasan Konservasi", score: 2 },
      {
        value: "proses",
        label: "Sedang Proses Verifikasi Lokasi Kebun",
        score: 1,
      },
      {
        value: "tidak",
        label: "Tidak, Kebun Tidak di Kawasan Konservasi",
        score: 0,
      },
    ],
  },
  {
    id: "q12",
    text: "12. Apakah Bapak/Ibu mengetahui bahwa kebun tidak boleh berada di dalam wilayah yang dilindungi secara hukum?",
    options: [
      { value: "ya", label: "Ya, Mengetahui Hal Ini", score: 2 },
      {
        value: "proses",
        label: "Sedang Proses Verifikasi Lokasi Kebun",
        score: 1,
      },
      { value: "tidak", label: "Tidak Mengetahui Hal Ini", score: 0 },
    ],
  },
  {
    id: "q13",
    text: "13. Apakah Bapak/Ibu memiliki rencana membuka kebun baru dalam waktu dekat?",
    options: [
      { value: "ya", label: "Ya, Berencana Membuka Kebun Baru", score: 2 },
      {
        value: "proses",
        label: "Sedang Proses Membuka Kebun Baru",
        score: 1,
      },
      { value: "tidak", label: "Tidak Berencana Membuka Kebun Baru", score: 0 },
    ],
    subQuestions: [
      {
        id: "q13_sub1",
        text: "13a. Jika ya, apakah Bapak/Ibu memahami bahwa tidak boleh membuka lahan dari masyarakat tanpa persetujuan mereka?",
        triggerValue: "ya",
        options: [
          { value: "ya", label: "Ya, Memahami Hal Ini", score: 2 },
          {
            value: "proses",
            label: "Sedang Proses Memahami Hal Ini",
            score: 1,
          },
          { value: "tidak", label: "Tidak Memahami Hal Ini", score: 0 },
        ],
      },
    ],
  },
  {
    id: "q14",
    text: "14. Apakah Bapak/Ibu menggunakan tenaga kerja dari luar keluarga inti untuk membantu kegiatan di kebun? (Termasuk tenaga harian lepas, tetangga yang dibayar, buruh panen musiman, dll)",
    options: [
      {
        value: "ya",
        label: "Ya, Menggunakan Tenaga Kerja Luar Keluarga",
        score: 2,
      },
      {
        value: "proses",
        label: "Sedang Proses Menggunakan Tenaga Kerja",
        score: 1,
      },
      {
        value: "tidak",
        label: "Tidak Menggunakan Tenaga Kerja Luar Keluarga",
        score: 0,
      },
    ],
    subQuestions: [
      {
        id: "q14_sub1",
        text: "14a. Apakah semua tenaga kerja di kebun Bapak/Ibu bekerja secara sukarela dan tanpa paksaan? ",
        triggerValue: "ya",
        options: [
          { value: "ya", label: "Ya, Semua Tenaga Kerja Sukarela", score: 2 },
          {
            value: "proses",
            label: "Sedang Proses Memberikan Kontrak Kerja",
            score: 1,
          },
          {
            value: "tidak",
            label: "Tidak Semua Tenaga Kerja Sukarela",
            score: 0,
          },
        ],
      },
      {
        id: "q14_sub2",
        text: "14b. Apakah Bapak/Ibu mengetahui dan memahami bahwa menggunakan tenaga kerja paksa tidak diperbolehkan dalam standar RSPO?",
        triggerValue: "ya",
        options: [
          {
            value: "ya",
            label: "Ya, Memahami Pentingnya Kontrak Kerja",
            score: 2,
          },
          {
            value: "proses",
            label: "Sedang Proses Memahami Pentingnya Kontrak Kerja",
            score: 1,
          },
          {
            value: "tidak",
            label: "Tidak Memahami Pentingnya Kontrak Kerja",
            score: 0,
          },
        ],
      },
    ],
  },
  {
    id: "q15",
    text: "15. Apakah ada anak-anak di bawah 15 tahun atau belum cukup umur sesuai hukum yang membantu di kebun Bapak/Ibu? ",
    options: [
      { value: "ya", label: "Ya, Ada Anak-anak Bekerja", score: 2 },
      {
        value: "proses",
        label: "Sedang Proses Memastikan Anak-anak Bekerja",
        score: 1,
      },
      { value: "tidak", label: "Tidak Ada Anak-anak Bekerja", score: 0 },
    ],
    subQuestions: [
      {
        id: "q15_sub1",
        text: "15a. Jika ada anak-anak yang membantu di kebun, apakah mereka hanya membantu keluarga, tidak mengganggu sekolah, dan tidak melakukan pekerjaan berat?",
        triggerValue: "ya",
        options: [
          {
            value: "ya",
            label: "Ya, Anak-anak Hanya Membantu Keluarga",
            score: 2,
          },
          {
            value: "proses",
            label: "Sedang Proses Memastikan Anak-anak Membantu Keluarga",
            score: 1,
          },
          { value: "tidak", label: "Tidak, Anak-anak Bekerja Berat", score: 0 },
        ],
      },
    ],
  },
  {
    id: "q16",
    text: "16. Apakah Bapak/Ibu membayar pekerja (jika ada) sesuai dengan ketentuan upah minimum atau aturan lainnya yang berlaku di daerah Bapak/Ibu?",
    options: [
      { value: "ya", label: "Ya, Membayar Pekerja Sesuai Aturan", score: 2 },
      {
        value: "proses",
        label: "Sedang Proses Memastikan Pembayaran",
        score: 1,
      },
      {
        value: "tidak",
        label: "Tidak Membayar Pekerja Sesuai Aturan",
        score: 0,
      },
    ],
  },
  {
    id: "q17",
    text: "17. Apakah pekerja di kebun Bapak/Ibu tahu bahwa mereka berhak untuk menyampaikan keluhan jika ada masalah dalam pekerjaan?",
    options: [
      { value: "ya", label: "Ya, Pekerja Tahu Hak Keluhan", score: 2 },
      {
        value: "proses",
        label: "Sedang Proses Memberitahu Pekerja",
        score: 1,
      },
      {
        value: "tidak",
        label: "Tidak, Pekerja Tidak Tahu Hak Keluhan",
        score: 0,
      },
    ],
  },
  {
    id: "q18",
    text: "18. Apakah Bapak/Ibu sudah menyediakan kondisi kerja yang aman bagi pekerja di kebun, termasuk untuk keluarga sendiri jika membantu?",
    options: [
      { value: "ya", label: "Ya, Kondisi Kerja Aman", score: 2 },
      {
        value: "proses",
        label: "Sedang Proses Menciptakan Kondisi Aman",
        score: 1,
      },
      { value: "tidak", label: "Tidak, Kondisi Kerja Tidak Aman", score: 0 },
    ],
    subQuestions: [
      {
        id: "q18_sub1",
        text: "18a.  Apakah Bapak/Ibu tahu bahwa menyediakan alat pelindung diri dan lingkungan kerja yang aman adalah bagian dari standar?",
        triggerValue: "ya",
        options: [
          { value: "ya", label: "Ya, Mengetahui Pentingnya APD", score: 2 },
          {
            value: "proses",
            label: "Sedang Proses Memahami Pentingnya APD",
            score: 1,
          },
          {
            value: "tidak",
            label: "Tidak Mengetahui Pentingnya APD",
            score: 0,
          },
        ],
      },
    ],
  },

  {
    id: "q19",
    text: "19. Apakah Bapak/Ibu pernah menyadari adanya perlakuan tidak adil atau diskriminatif terhadap pekerja di kebun? ",
    options: [
      {
        value: "ya",
        label:
          "ya, Saya pernah menyadari adanya perlakuan tidak adil dan diskriminatif terhadap pekerja di kebun",
        score: 3,
      },
      {
        value: "tidak",
        label:
          "Tidak, Saya tidak pernah menyadari adanya perlakuan tidak adil dan diskriminatif terhadap pekerja di kebun",
        score: 2,
      },
      {
        value: "proses",
        label: "Sedang proses memahami pentingnya perlakuan adil",
        score: 2,
      },
    ],
    dependsOn: {
      questionId: "q14",
      requiredValue: "ya",
    },
  },
  {
    id: "q20",
    text: "20. Apakah Bapak/Ibu memahami bahwa tindakan kekerasan, pelecehan, atau diskriminasi terhadap pekerja tidak diperbolehkan?",
    options: [
      {
        value: "ya",
        label:
          "Ya, Saya memahami bahwa tindakan kekerasan, pelecehan, atau diskriminasi terhadap pekerja tidak diperbolehkan",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, Saya tidak memahami bahwa tindakan kekerasan, pelecehan, atau diskriminasi terhadap pekerja tidak diperbolehkan",
        score: 0,
      },
      {
        value: "proses",
        label: "Sedang proses memahami pentingnya perlakuan adil",
        score: 1,
      },
    ],
    dependsOn: {
      questionId: "q14",
      requiredValue: "ya",
    },
  },
  {
    id: "q21",
    text: "21. Apakah Bapak/Ibu mengetahui adanya area konservasi atau hutan penting di sekitar lahan? ",
    options: [
      {
        value: "ya",
        label:
          "Ya, Saya mengetahui adanya area konservasi atau hutan penting di sekitar lahan",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, Saya tidak mengetahui adanya area konservasi atau hutan penting di sekitar lahan",
        score: 0,
      },
      {
        value: "proses",
        label: "Sedang proses memahami pentingnya konservasi",
        score: 1,
      },
    ],
    subQuestions: [
      {
        id: "q21_sub1",
        text: "21a. Apakah Bapak/Ibu mengetahui pentingnya menjaga satwa liar dan ekosistem di sekitar kebun?",
        triggerValue: "tidak",
        options: [
          {
            value: "ya",
            label:
              "Ya, Mengetahuai Penting nya Menjaga Satwa Liar dan Ekosistem di Sekitar Kebun",
            score: 2,
          },
          {
            value: "proses",
            label:
              "Sedang Proses Memahami Pentingnya Menjaga Satwa Liar dan Ekosistem",
            score: 1,
          },
          {
            value: "tidak",
            label:
              "Tidak Mengetahui Pentingnya Menjaga Satwa Liar dan Ekosistem",
            score: 0,
          },
        ],
      },
      {
        id: "q21_sub2",
        text: "21b. Apakah Bapak/Ibu bersedia ikut serta dalam pelatihan tentang pelestarian lingkungan dan satwa langka?",
        triggerValue: "tidak",
        options: [
          {
            value: "ya",
            label: "Ya, Berencana Melakukan Konservasi",
            score: 1,
          },
          {
            value: "mungkin",
            label: "Mungkin Akan Melakukan Konservasi",
            score: 1,
          },
          {
            value: "tidak",
            label: "Tidak Berencana Melakukan Konservasi",
            score: 0,
          },
        ],
      },
    ],
  },
  {
    id: "q22",
    text: "22. Apakah Bapak/Ibu memiliki lahan sawit yang dibuka setelah tahun 2005?",
    options: [
      { value: "ya", label: "Ya, Lahan Dibuka Setelah 2005", score: 2 },
      { value: "tidak", label: "Tidak, Lahan Dibuka Sebelum 2005", score: 0 },
      {
        value: "proses",
        label: "Sedang Proses Memahami Aturan Pembukaan Lahan",
        score: 1,
      },
    ],
    subQuestions: [
      {
        id: "q22_sub1",
        text: "22a. Jika ya, apakah Bapak/Ibu bersedia untuk mengikuti proses identifikasi dan perbaikan lahan tersebut bersama kelompok?",
        triggerValue: "ya",
        options: [
          {
            value: "ya",
            label:
              "Ya, Bersedia Mengikuti Proses Identifikasi dan Perbaikan Lahan",
            score: 2,
          },
          {
            value: "proses",
            label:
              "Sedang Proses Mengikuti Proses Identifikasi dan Perbaikan Lahan",
            score: 1,
          },
          {
            value: "tidak",
            label:
              "Tidak Bersedia Mengikuti Proses Identifikasi dan Perbaikan Lahan",
            score: 0,
          },
        ],
      },
    ],
  },
  {
    id: "q23",
    text: "23. Apakah Bapak/Ibu memiliki rencana untuk menanam kelapa sawit di lahan baru?  ",
    options: [
      {
        value: "ya",
        label: "Ya, Berencana Menanam Kelapa Sawit di Lahan Baru",
        score: 2,
      },
      {
        value: "tidak",
        label: "Tidak, Tidak Berencana Menanam Kelapa Sawit di Lahan Baru",
        score: 0,
      },
      {
        value: "proses",
        label: "Sedang Proses Memahami Pentingnya Tidak Menanam di Lahan Baru",
        score: 1,
      },
    ],
    subQuestions: [
      {
        id: "q23_sub1",
        text: "23a. Apakah Bapak/Ibu mengetahui bahwa menanam di hutan, gambut, atau lereng curam tidak diperbolehkan?",
        triggerValue: "ya",
        options: [
          {
            value: "ya",
            label: "Ya, Mengetahui aturan Menanam di Lahan Baru",
            score: 2,
          },
          {
            value: "proses",
            label: "Sedang Proses Memahami Aturan Menanam di Lahan Baru",
            score: 1,
          },
          {
            value: "tidak",
            label: "Tidak, Tidak Mengetahui Aturan Menanam di Lahan Baru",
            score: 0,
          },
        ],
      },
    ],
  },
  {
    id: "q24",
    text: "24. Apakah Bapak/Ibu memiliki lahan di area gambut?",
    options: [
      { value: "ya", label: "Ya, Memiliki Lahan di Area Gambut", score: 2 },
      {
        value: "tidak",
        label: "Tidak, Tidak Memiliki Lahan di Area Gambut",
        score: 0,
      },
      {
        value: "proses",
        label: "Sedang Proses Memahami Pentingnya Tidak Menanam di Area Gambut",
        score: 1,
      },
    ],
    subQuestions: [
      {
        id: "q24_sub1",
        text: "24a. Apakah Bapak/Ibu mengetahui pentingnya mengelola air dan mencegah kebakaran di lahan gambut?",
        triggerValue: "ya",
        options: [
          {
            value: "ya",
            label:
              "Ya, Mengetahui Pentingnya Mengelola Air dan Mencegah Kebakaran di Lahan Gambut",
            score: 2,
          },
          {
            value: "proses",
            label:
              "Sedang Proses Memahami Pentingnya Mengelola Air dan Mencegah Kebakaran di Lahan Gambut",
            score: 1,
          },
          {
            value: "tidak",
            label:
              "Tidak Mengetahui Pentingnya Mengelola Air dan Mencegah Kebakaran di Lahan Gambut",
            score: 0,
          },
        ],
      },
    ],
  },
  {
    id: "q25",
    text: "25. Jika memiliki rencana tanam ulang di gambut, apakah Bapak/Ibu tahu bahwa harus dilakukan di lahan dengan risiko banjir/salinasi yang rendah?",
    options: [
      {
        value: "ya",
        label:
          "Ya, Mengetahui harus Tanam Ulang di Lahan dengan Risiko Banjir/salinasi Rendah",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, Tidak Mengetahui harus Tanam Ulang di Lahan dengan Risiko Banjir/salinasi Rendah",
        score: 0,
      },
      {
        value: "proses",
        label:
          "Sedang Proses Memahami Pentingnya Tanam Ulang di Lahan dengan Risiko Banjir/salinasi Rendah",
        score: 1,
      },
    ],
    subQuestions: [
      {
        id: "q25_sub1",
        text: "25a. Apakah Bapak/Ibu siap melakukan penilaian risiko sebelum tanam ulang?",
        triggerValue: "ya",
        options: [
          {
            value: "ya",
            label: "Ya, Siap Melakukan Penilaian Risiko Sebelum Tanam Ulang",
            score: 2,
          },
          {
            value: "proses",
            label:
              "Sedang Proses Memahami Pentingnya Penilaian Risiko Sebelum Tanam Ulang",
            score: 1,
          },
          {
            value: "tidak",
            label: "Tidak Siap Melakukan Penilaian Risiko Sebelum Tanam Ulang",
            score: 0,
          },
        ],
      },
    ],
  },
  {
    id: "q26",
    text: "26. Apakah Bapak/Ibu pernah menggunakan api untuk membuka lahan atau mengelola limbah di kebun?",
    options: [
      {
        value: "ya",
        label:
          "Ya, Tidak Pernah Menggunakan Api untuk Membuka Lahan atau Mengelola Limbah",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, Pernah Menggunakan Api untuk Membuka Lahan atau Mengelola Limbah",
        score: 0,
      },
      {
        value: "proses",
        label: "Sedang Proses Memahami Pentingnya Tidak Menggunakan Api",
        score: 1,
      },
    ],
    subQuestions: [
      {
        id: "q26_sub1",
        text: "26a. Apakah Bapak/Ibu tahu bahwa penggunaan api tidak diperbolehkan dan ada cara lain yang lebih aman?",
        triggerValue: "ya",
        options: [
          {
            value: "ya",
            label: "Ya, Mengetahui Penggunaan Api Tidak Diperbolehkan",
            score: 2,
          },
          {
            value: "proses",
            label: "Sedang Proses Memahami Penggunaan Api Tidak Diperbolehkan",
            score: 1,
          },
          {
            value: "tidak",
            label: "Tidak Mengetahui Penggunaan Api Tidak Diperbolehkan",
            score: 0,
          },
        ],
      },
    ],
  },
  {
    id: "q27",
    text: "27. Apakah Bapak/Ibu mengetahui batas sungai di kebun Bapak/Ibu?  ",
    options: [
      { value: "ya", label: "Ya, Mengetahui Batas Sungai di Kebun", score: 2 },
      {
        value: "tidak",
        label: "Tidak, Tidak Mengetahui Batas Sungai di Kebun",
        score: 0,
      },
      {
        value: "proses",
        label:
          "Sedang Proses Memahami Pentingnya Mengetahui Batas Sungai di Kebun",
        score: 1,
      },
    ],
    subQuestions: [
      {
        id: "q27_sub1",
        text: "27a. Apakah Bapak/Ibu tahu bahwa tidak boleh menanam di area sempadan sungai?",
        triggerValue: "ya",
        options: [
          {
            value: "ya",
            label: "Ya, Mengetahui Tidak Boleh Menanam di Area Sempadan Sungai",
            score: 2,
          },
          {
            value: "proses",
            label:
              "Sedang Proses Memahami Tidak Boleh Menanam di Area Sempadan Sungai",
            score: 1,
          },
          {
            value: "tidak",
            label:
              "Tidak Mengetahui Tidak Boleh Menanam di Area Sempadan Sungai",
            score: 0,
          },
        ],
      },
    ],
  },
  {
    id: "q28",
    text: "28. Apakah Bapak/Ibu masih menggunakan pestisida seperti paraquat atau yang tergolong berbahaya?",
    options: [
      { value: "ya", label: "Ya, Menggunakan Pestisida Berbahaya", score: 2 },
      {
        value: "tidak",
        label: "Tidak Menggunakan Pestisida Berbahaya",
        score: 0,
      },
      {
        value: "proses",
        label:
          "Sedang Proses Memahami Pentingnya Tidak Menggunakan Pestisida Berbahaya",
        score: 1,
      },
    ],
    subQuestions: [
      {
        id: "q28_sub1",
        text: "28a. Apakah Bapak/Ibu mengetahui bahwa penggunaan pestisida tersebut tidak diperbolehkan dan harus dihentikan?",
        triggerValue: "ya",
        options: [
          {
            value: "ya",
            label: "Ya, Mengetahui Pestisida Harus Digunakan dengan Aman",
            score: 2,
          },
          {
            value: "proses",
            label:
              "Sedang Proses Memahami Pestisida Harus Digunakan dengan Aman",
            score: 1,
          },
          {
            value: "tidak",
            label:
              "Tidak, Tidak Mengetahui Pestisida Harus Digunakan dengan Aman",
            score: 0,
          },
        ],
      },
    ],
  },
  {
    id: "q29",
    text: "29. Apakah kelompok memiliki prosedur untuk menerima dan menilai rencana tanam baru dari petani?",
    options: [
      {
        value: "ya",
        label: "Ya, Kelompok Memiliki Prosedur Rencana Tanam Baru",
        score: 2,
      },
      {
        value: "tidak",
        label: "Tidak, Kelompok Tidak Memiliki Prosedur Rencana Tanam Baru",
        score: 0,
      },
      {
        value: "proses",
        label: "Sedang Proses Memahami Pentingnya Prosedur Rencana Tanam Baru",
        score: 1,
      },
    ],
    roleSpecific: "manajer",
    subQuestions: [
      {
        id: "q29_sub1",
        text: "29a. Apakah kelompok telah memfasilitasi identifikasi lokasi sensitif lingkungan (HCV/HCS) sebelum petani melakukan penanaman baru?",
        triggerValue: "ya",
        options: [
          { value: "ya", label: "Ya, telah difasilitasi", score: 2 },
          { value: "proses", label: "Sedang Proses memfasilitasi", score: 1 },
          {
            value: "tidak",
            label: "Tidak, Tidak di berikan fasilitas",
            score: 0,
          },
        ],
      },
    ],
  },
  {
    id: "q30",
    text: "30. Apakah kelompok memiliki catatan petani yang memiliki lahan gambut?",
    options: [
      {
        value: "ya",
        label:
          "Ya, Kelompok memiliki catatan petani yang memiliki lahan gambut",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, Kelompok Tidak Memiliki catatan petani yang memiliki lahan gambut",
        score: 0,
      },
      {
        value: "proses",
        label: "Sedang Proses mencatat petani yang memiliki lahan gambut",
        score: 1,
      },
    ],
    roleSpecific: "manajer",
    subQuestions: [
      {
        id: "q30_sub1",
        text: "30a. Apakah kelompok sudah memetakan area tersebut dan menyimpannya sebagai dokumen kelompok?",
        triggerValue: "ya",
        options: [
          {
            value: "ya",
            label:
              "Ya, Kelompok sudah memetakan area dan menyimpannya sebagai dokumen kelompok",
            score: 2,
          },
          {
            value: "tidak",
            label: "Tidak, Kelompok belum memetakan area",
            score: 0,
          },
          {
            value: "proses",
            label: "Sedang proses memetakan area",
            score: 1,
          },
        ],
      },
    ],
  },
  {
    id: "q31",
    text: "31. Apakah kelompok memeriksa dan mencatat apakah petani baru pernah membuka lahan dengan cara dibakar? ",
    options: [
      {
        value: "ya",
        label:
          "Ya, Kelompok telah memeriksa dan mencatat petani baru yang pernah membuka lahan dengan cara dibakar",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, Kelompok belum mencatat dan memeriksa petani baru yang pernah membuka lahan dengan cara dibakar",
        score: 0,
      },
      {
        value: "proses",
        label:
          "Sedang prose mencatat dan memeriksa petani baru yang pernah membuka lahan dengan cara dibakar",
        score: 1,
      },
    ],
    roleSpecific: "manajer",
    subQuestions: [
      {
        id: "q31_sub1",
        text: "31. Apakah kelompok memiliki catatan historis penggunaan api dari semua anggota baru sejak 2019?",
        triggerValue: "ya",
        options: [
          {
            value: "ya",
            label: "Ya, Kelompok memiliki catatan historis penggunaan api",
            score: 2,
          },
          {
            value: "tidak",
            label:
              "Tidak, Kelompok tidak memiliki catatan historis penggunaan api",
            score: 0,
          },
          {
            value: "proses",
            label: "Sedang proses mencatat historis penggunaan api",
            score: 1,
          },
        ],
      },
    ],
  },
  {
    id: "q32",
    text: "32. Apakah kelompok memiliki daftar pestisida yang digunakan oleh anggota?",
    options: [
      {
        value: "ya",
        label:
          "Ya, Kelompok memiliki daftar pestisida yang digunakan oleh anggota",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, Kelompok tidak memiliki daftar pestisida yang digunakan oleh anggota",
        score: 0,
      },
      {
        value: "proses",
        label:
          "Sedang proses mencatat daftar pestisida yang digunakan oleh anggota",
        score: 1,
      },
    ],
    roleSpecific: "manajer",
    subQuestions: [
      {
        id: "q32_sub1",
        text: "32a. Apakah kelompok menyimpan informasi tentang pestisida berbahaya (misalnya WHO 1A/1B) yang pernah digunakan oleh anggota?",
        triggerValue: "ya",
        options: [
          {
            value: "ya",
            label: "Ya, Kelompok menyimpan informasi tentang pestisida",
            score: 2,
          },
          {
            value: "tidak",
            label:
              "Tidak, Kelompok tidak menyimpan informasi tentang pestisida",
            score: 0,
          },
          {
            value: "proses",
            label: "Sedang Proses, menyimpan informasi tentang pestisida",
            score: 1,
          },
        ],
      },
    ],
  },
];

export const stage2Questions: Question[] = [
  {
    id: "q200_1",
    text: "1. Apakah Bapak/Ibu pernah mengikuti pelatihan terkait mekanisme harga tandan buah segar (TBS) kelapa sawit?",
    options: [
      {
        value: "ya",
        label:
          "Ya, saya pernah mengikuti pelatihan terkait mekanisme harga tandan buah segar (TBS) kelapa sawit",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, saya tidak pernah mengikuti pelatihan terkait mekanisme harga tandan buah segar (TBS) kelapa sawit",
        score: 0,
      },
      {
        value: "proses",
        label: "Sedang Proses daftar pelatihan",
        score: 1,
      },
    ],
  },
  {
    id: "q200_2",
    text: "2. Apakah Bapak/Ibu memahami bagaimana kelompok mengatur keuangan secara transparan dan bertanggung jawab?",
    options: [
      {
        value: "ya",
        label:
          "Ya, saya memahami bagaimana kelompok mengatur keuangan secara transparan dan bertanggung jawab",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, saya tidak memahami bagaimana kelompok mengatur keuangan secara transparan dan bertanggung jawab",
        score: 0,
      },
      {
        value: "proses",
        label:
          "Sedang Proses memahami kelompok mengatur keuangan secara transparan dan bertanggung jawab",
        score: 1,
      },
    ],
  },
  {
    id: "q200_3",
    text: "3. Apakah Bapak/Ibu mengetahui aturan atau praktik terbaik dalam mengelola kelompok petani sawit?",
    options: [
      {
        value: "ya",
        label:
          "Ya, saya mengetahui aturan atau praktik terbaik dalam mengelola kelompok petani sawit",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, saya tidak mengetahui aturan atau praktik terbaik dalam mengelola kelompok petani sawit",
        score: 0,
      },
      {
        value: "proses",
        label:
          "Sedang Proses memahami aturan atau praktik terbaik dalam mengelola kelompok petani sawit",
        score: 1,
      },
    ],
  },
  {
    id: "q200_4",
    text: "4. Apakah kelompok sudah punya sistem sederhana untuk mencatat, memeriksa, dan menindak jika ada petani yang tidak ikut aturan?",
    options: [
      {
        value: "ya",
        label:
          "Ya, kelompok sudah punya sistem sederhana untuk mencatat, memeriksa, dan menindak jika ada petani yang tidak ikut aturan",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, kelompok tidak memiliki sistem sederhana untuk mencatat, memeriksa, dan menindak jika ada petani yang tidak ikut aturan",
        score: 0,
      },
      {
        value: "proses",
        label:
          "Sedang Proses membuat sistem sederhana untuk mencatat, memeriksa, dan menindak jika ada petani yang tidak ikut aturan",
        score: 1,
      },
    ],
    roleSpecific: "manajer",
  },
  {
    id: "q200_5",
    text: "5. Apakah semua anggota kelompok sudah tahu aturan-aturan dasar ini dan bagaimana cara menjalankannya?",
    options: [
      {
        value: "ya",
        label:
          "Ya, semua anggota kelompok sudah tahu aturan-aturan dasar ini dan menjalankannya",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, semua anggota kelompok belum mengetahui aturan-aturan dasar ini dan menjalankannya",
        score: 0,
      },
      {
        value: "proses",
        label:
          "Sedang Proses memahami aturan-aturan dasar ini dan bagaimana cara menjalankannya",
        score: 1,
      },
    ],
    roleSpecific: "manajer",
  },
  {
    id: "q200_6",
    text: "6. Apakah kelompok sudah menyelenggarakan pelatihan untuk anggota tentang harga TBS, pengelolaan keuangan, dan organisasi petani sawit?",
    options: [
      {
        value: "ya",
        label:
          "Ya, kelompok sudah menyelenggarakan pelatihan untuk anggota tentang harga TBS, pengelolaan keuangan, dan organisasi petani sawit",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, kelompok belum menyelenggarakan pelatihan untuk anggota tentang harga TBS, pengelolaan keuangan, dan organisasi petani sawit",
        score: 0,
      },
      {
        value: "proses",
        label:
          "Sedang Proses menyelenggarakan pelatihan untuk anggota tentang harga TBS, pengelolaan keuangan, dan organisasi petani sawit",
        score: 1,
      },
    ],
    roleSpecific: "manajer",
  },
  {
    id: "q200_7",
    text: "7. Apakah Bapak/Ibu pernah mengikuti pelatihan mengenai pengelolaan usaha kebun, seperti perencanaan, pencatatan, atau pengawasan kebun?",
    options: [
      {
        value: "ya",
        label:
          "Ya, saya pernah mengikuti pelatihan mengenai pengelolaan usaha kebun, seperti perencanaan, pencatatan, atau pengawasan kebun",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, saya tidak pernah mengikuti pelatihan mengenai pengelolaan usaha kebun, seperti perencanaan, pencatatan, atau pengawasan kebun",
        score: 0,
      },
      {
        value: "proses",
        label:
          "Sedang Proses pendaftaran untuk mengikuti pelatihan mengenai pengelolaan usaha kebun, seperti perencanaan, pencatatan, atau pengawasan kebun",
        score: 1,
      },
    ],
  },
  {
    id: "q200_8",
    text: "8. Apakah Bapak/Ibu melakukan pencatatan hasil panen, penggunaan pupuk, benih, atau biaya di kebun Bapak/Ibu?",
    options: [
      {
        value: "ya",
        label:
          "Ya, saya melakukan pencatatan hasil panen, penggunaan pupuk, benih, atau biaya di kebun",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, saya tidak pernah melakukan pencatatan hasil panen, penggunaan pupuk, benih, atau biaya di kebun",
        score: 0,
      },
      {
        value: "proses",
        label:
          "Sedang Proses melakukan pencatatan hasil panen, penggunaan pupuk, benih, atau biaya di kebun",
        score: 1,
      },
    ],
    subQuestions: [
      {
        id: "q200_8a",
        text: "8a. Apa saja yang biasa Bapak/Ibu catat? (Misalnya: jumlah panen, jenis benih, biaya pupuk, atau transaksi jual beli?)",
        triggerValue: "ya",
        options: [
          {
            value: "ya",
            label: "Jumlah panen dan Jenis benih",
            score: 0,
          },
          {
            value: "ya",
            label: "biaya pupuk",
            score: 0,
          },
          {
            value: "ya",
            label: "transaksi jual beli",
            score: 0,
          },
        ],
      },
      {
        id: "q200_8b",
        text: "8b. Apakah Bapak/Ibu merasa terbantu dengan adanya pencatatan tersebut dalam mengelola kebun?",
        triggerValue: "ya",
        options: [
          {
            value: "ya",
            label:
              "Ya, saya merasa terbantu dengan adanya pencatatan tersebut dalam mengelola kebun",
            score: 2,
          },
          {
            value: "tidak",
            label:
              "Tidak, saya merasa tidak terbantu dengan adanya pencatatan tersebut dalam mengelola kebun",
            score: 0,
          },
          {
            value: "proses",
            label:
              "Sedang proses mencatat dan belum mengetahui terbantu dengan adanya pencatatan tersebut dalam mengelola kebun",
            score: 1,
          },
        ],
      },
    ],
  },
  {
    id: "q200_9",
    text: "9. Apakah Bapak/Ibu pernah mengikuti pelatihan tentang cara bertani sawit yang baik (Good Agricultural Practices / GAP)?",
    options: [
      {
        value: "ya",
        label:
          "Ya, saya pernah mengikuti pelatihan tentang cara bertani sawit yang baik",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, saya tidak pernah mengikuti pelatihan tentang cara bertani sawit yang baik",
        score: 0,
      },
      {
        value: "proses",
        label:
          "Sedang Proses pendaftaran untuk mengikuti pelatihan tentang cara bertani sawit yang baik",
        score: 1,
      },
    ],
    subQuestions: [
      {
        id: "q200_9a",
        text: "9a. Dalam pelatihan tersebut, apakah dibahas cara menanam, merawat, memanen, atau menjaga lingkungan kebun sawit?",
        triggerValue: "ya",
        options: [
          {
            value: "ya",
            label: "Ya, dalam pelatihan dibahas materi tersebut",
            score: 2,
          },
          {
            value: "tidak",
            label: "Tidak, dalam pelatihan tidak dibahas materi tersebut",
            score: 0,
          },
          {
            value: "ya",
            label:
              "Sedang dalam pelatihan dan belum mengetahui materi tersebut dibahas atau tidak",
            score: 1,
          },
        ],
      },
      {
        id: "q200_9b",
        text: "9b. Apa hal paling penting yang Bapak/Ibu pelajari dari pelatihan tersebut?",
        triggerValue: "ya",
        options: [
          {
            value: "ya",
            label:
              "Ya, saya jadi mengetahui tentang cara bertani sawit yang baik",
            score: 2,
          },
          {
            value: "tidak",
            label: "Tidak, saya tidak tahu apa - apa",
            score: 0,
          },
          {
            value: "proses",
            label: "Sedang proses memahami materi pelatihan",
            score: 1,
          },
        ],
      },
    ],
  },
  {
    id: "q200_10",
    text: "10. Apakah Anda memiliki bukti tertulis bahwa lahan yang Anda kelola adalah milik Anda atau Anda berhak menggunakannya?",
    options: [
      {
        value: "ya",
        label: "Ya, saya memiliki bukti",
        score: 2,
      },
      {
        value: "tidak",
        label: "Tidak, saya tidak memiliki bukti",
        score: 0,
      },
      {
        value: "proses",
        label: "Sedang Proses mengurus dokumen untuk bukti",
        score: 1,
      },
    ],
    subQuestions: [
      {
        id: "q200_10a",
        text: "10a. Jika belum memiliki bukti tertulis, apakah Anda sedang mengurus dokumen resmi untuk mengakui kepemilikan atau hak atas lahan tersebut?",
        triggerValue: "belum",
        options: [
          {
            value: "ya",
            label: "Ya, saya sedang mengurus dokumen tersebut",
            score: 2,
          },
          {
            value: "tidak",
            label: "Tidak, saya tidak sedang mengurus dokumen tersebut",
            score: 0,
          },
          {
            value: "ya",
            label: "Sedang dalam proses pengurusan",
            score: 1,
          },
        ],
      },
    ],
  },
  {
    id: "q200_11",
    text: "11. Apakah lahan yang Anda kelola diperoleh dari warisan, pembelian, atau berdasarkan kesepakatan adat?",
    options: [
      {
        value: "ya",
        label:
          "Ya, lahan yang saya kelola dari warisan/pembelian/kesepakatan adat",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, lahan yang saya kelola bukan dari warisan/pembelian/kesepakatan adat",
        score: 0,
      },
      {
        value: "proses",
        label: "Sedang Proses memahami lahan yang saya kelola",
        score: 1,
      },
    ],
    subQuestions: [
      {
        id: "q200_11a",
        text: "11a. Apakah ada peta atau koordinat lahan Anda yang dapat diperlihatkan? (opsional)",
        triggerValue: "ya",
        options: [
          {
            value: "ya",
            label: "Ya",
            score: 2,
          },
          {
            value: "tidak",
            label: "Tidak",
            score: 0,
          },
          {
            value: "ya",
            label: "Sedang dalam proses pengurusan",
            score: 1,
          },
        ],
      },
    ],
  },
  {
    id: "q200_12",
    text: "12. Apakah Anda memperoleh lahan dari masyarakat adat, komunitas lokal, atau orang lain?",
    options: [
      {
        value: "ya",
        label:
          "Ya, lahan yang saya peroleh dari masyarakat adat/komunitas lokal/orang lain",
        score: 2,
      },
      {
        value: "tidak",
        label: "Tidak, lahan yang saya peroleh dari keluarga saya",
        score: 0,
      },
      {
        value: "proses",
        label: "Sedang Proses memahami lahan yang saya punya",
        score: 1,
      },
    ],
    subQuestions: [
      {
        id: "q200_12a",
        text: "12a. Jika ya, apakah ada kesepakatan atau persetujuan dari mereka sebelum lahan digunakan?",
        triggerValue: "ya",
        options: [
          {
            value: "ya",
            label: "Ya",
            score: 2,
          },
          {
            value: "tidak",
            label: "Tidak",
            score: 0,
          },
          {
            value: "ya",
            label: "Sedang dalam proses persetujuan",
            score: 1,
          },
        ],
      },
    ],
  },
  {
    id: "q200_13",
    text: "13. Apakah proses memperoleh lahan dilakukan secara sukarela dan tanpa tekanan dari pihak manapun?",
    options: [
      {
        value: "ya",
        label: "Ya, secara sukarela dan tanpa tekanan dari pihak manapun",
        score: 2,
      },
      {
        value: "tidak",
        label: "Tidak, lahan yang saya peroleh terdapat tekanan",
        score: 0,
      },
      {
        value: "proses",
        label: "Sedang Proses memahami lahan yang saya punya",
        score: 1,
      },
    ],
  },
  {
    id: "q200_14",
    text: "14. Apakah Anda bisa menjelaskan bagaimana proses komunikasi dan persetujuan dilakukan saat memperoleh lahan tersebut?",
    options: [
      {
        value: "ya",
        label: "Ya, secara sukarela dan tanpa tekanan dari pihak manapun",
        score: 2,
      },
      {
        value: "tidak",
        label: "Tidak, lahan yang saya peroleh terdapat tekanan",
        score: 0,
      },
      {
        value: "proses",
        label: "Sedang Proses memahami lahan yang saya punya",
        score: 1,
      },
    ],
  },
  {
    id: "q200_15",
    text: "15. Apakah lahan Bapak/Ibu sedang disengketakan oleh masyarakat sekitar atau pihak lain?",
    options: [
      {
        value: "ya",
        label: "Ya, lahan saya sedang disengketakan",
        score: 2,
      },
      {
        value: "tidak",
        label: "Tidak, lahan saya tidak disengketakan",
        score: 0,
      },
      {
        value: "proses",
        label: "Sedang Proses disengketakan",
        score: 1,
      },
    ],
    subQuestions: [
      {
        id: "q200_15a",
        text: "15a. Jika ya, apakah sedang ada proses penyelesaian yang disepakati semua pihak?",
        triggerValue: "ya",
        options: [
          {
            value: "ya",
            label: "Ya, sedang ada proses penyelesaian yang disepakati",
            score: 2,
          },
          {
            value: "tidak",
            label: "Tidak, tidak ada proses penyelesaian yang disepakati",
            score: 0,
          },
          {
            value: "ya",
            label: "Sedang dalam proses pembicaraan",
            score: 1,
          },
        ],
      },
    ],
  },
  {
    id: "q200_16",
    text: "16. Apakah Bapak/Ibu pernah mengikuti pelatihan tentang bagaimana cara meminta persetujuan masyarakat sekitar sebelum membuka lahan?",
    options: [
      {
        value: "ya",
        label: "Ya, saya pernah mengikuti pelatihan",
        score: 2,
      },
      {
        value: "tidak",
        label: "Tidak, saya tidak pernah mengikuti",
        score: 0,
      },
      {
        value: "proses",
        label: "Sedang Proses memahami pendaftaran pelatihan",
        score: 1,
      },
    ],
    dependsOn: {
      questionId: "q9",
      requiredValue: "ya",
    },
  },
  {
    id: "q200_17",
    text: "17. Apakah Bapak/Ibu pernah mengikuti pelatihan tentang hak-hak pekerja atau kerja sukarela?",
    options: [
      {
        value: "ya",
        label: "Ya, saya pernah mengikuti pelatihan",
        score: 2,
      },
      {
        value: "tidak",
        label: "Tidak, saya tidak pernah mengikuti",
        score: 0,
      },
      {
        value: "proses",
        label: "Sedang Proses memahami pendaftaran pelatihan",
        score: 1,
      },
    ],
    dependsOn: {
      questionId: "q14",
      requiredValue: "ya",
    },
  },
  {
    id: "q200_18",
    text: "18. Apakah Bapak/Ibu memastikan bahwa semua pekerja (termasuk anggota keluarga) bekerja secara sukarela?",
    options: [
      {
        value: "ya",
        label:
          "Ya, saya memastikan bahwa semua pekerja bekerja secara sukarela",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, saya tidak memastikan bahwa semua pekerja bekerja secara sukarela",
        score: 0,
      },
      {
        value: "proses",
        label:
          "Sedang Proses memastikan bahwa semua pekerja bekerja secara sukarela",
        score: 1,
      },
    ],
    dependsOn: {
      questionId: "q14",
      requiredValue: "ya",
    },
  },
  {
    id: "q200_20",
    text: "20. Apakah ada dokumen identitas (KTP, KK, dll) milik pekerja yang disimpan oleh Bapak/Ibu?",
    options: [
      {
        value: "ya",
        label: "Ya, ada",
        score: 2,
      },
      {
        value: "tidak",
        label: "Tidak ada",
        score: 0,
      },
      {
        value: "proses",
        label: "Sedang Proses administrasi",
        score: 1,
      },
    ],
    dependsOn: {
      questionId: "q14",
      requiredValue: "ya",
    },
  },
  {
    id: "q200_21",
    text: "21. Apakah pekerja diminta membayar biaya saat pertama kali bekerja ?",
    options: [
      {
        value: "ya",
        label:
          "Ya, pekerja diminta untuk membayar biaya saat pertama kali bekerja",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, pekerja tidak diminta untuk membayar biaya saat pertama kali bekerja",
        score: 0,
      },
      {
        value: "proses",
        label: "Sedang Proses pendaftaran pekerja",
        score: 1,
      },
    ],
    dependsOn: {
      questionId: "q14",
      requiredValue: "ya",
    },
  },
  {
    id: "q200_22",
    text: "22. Apakah ada perjanjian kerja tertulis antara Bapak/Ibu dan pekerja?",
    options: [
      {
        value: "ya",
        label: "Ya, ada perjanjian tertulis",
        score: 2,
      },
      {
        value: "tidak",
        label: "Tidak, tidak ada perjanjian tertulis",
        score: 0,
      },
      {
        value: "proses",
        label: "Sedang ada proses pembuatan perjanjian",
        score: 1,
      },
    ],
    dependsOn: {
      questionId: "q14",
      requiredValue: "ya",
    },
  },
  {
    id: "q200_23",
    text: "23. Apakah pekerja bebas mengundurkan diri kapan saja tanpa ancaman atau denda?",
    options: [
      {
        value: "ya",
        label: "Ya, pekerja bebas mengundurkan diri tanpa ancaman atau denda",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, pekerja dipersulit untuk mengundurkan diri dan terdapat denda dan ancaman",
        score: 0,
      },
      {
        value: "proses",
        label: "Sedang Proses melihat pekerja",
        score: 1,
      },
    ],
    dependsOn: {
      questionId: "q14",
      requiredValue: "ya",
    },
  },
  {
    id: "q200_24",
    text: "24. Apakah ada sistem lembur? Jika ya, apakah lembur dilakukan secara sukarela?",
    options: [
      {
        value: "ya",
        label: "Ya, ada sistem lembur dan dilakukan secara sukarela",
        score: 2,
      },
      {
        value: "tidak",
        label: "Tidak, pekerja tidak ada sistem lembur",
        score: 0,
      },
      {
        value: "proses",
        label: "Sedang ada sistem lembur dan dilakukan tidak secara sukarela",
        score: 1,
      },
    ],
    dependsOn: {
      questionId: "q14",
      requiredValue: "ya",
    },
  },
  {
    id: "q200_25",
    text: "25. Apakah pernah ada gaji yang ditahan oleh Bapak/Ibu?",
    options: [
      {
        value: "ya",
        label: "Ya, pernah ada",
        score: 2,
      },
      {
        value: "tidak",
        label: "Tidak pernah ada",
        score: 0,
      },
      {
        value: "proses",
        label: "Sedang proses sistem tidak ada penahanan gaji",
        score: 1,
      },
    ],
    dependsOn: {
      questionId: "q14",
      requiredValue: "ya",
    },
  },
  {
    id: "q200_26",
    text: "26. Apakah Bapak/Ibu memahami arti kerja paksa dan bagaimana menghindarinya?",
    options: [
      {
        value: "ya",
        label:
          "Ya, saya memahami arti kerja paksa dan bagaimana menghindarinya",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, saya tidak memahami arti kerja paksa dan bagaimana menghindarinya",
        score: 0,
      },
      {
        value: "proses",
        label: "Sedang proses memahami arti tersebut",
        score: 1,
      },
    ],
    dependsOn: {
      questionId: "q14",
      requiredValue: "ya",
    },
  },
  {
    id: "q200_27",
    text: "27. Apakah Bapak/Ibu sudah mengetahui dan mengikuti aturan kelompok bahwa anak di bawah 15 tahun hanya boleh bantu ringan dan tidak boleh dipakai sebagai pekerja?",
    options: [
      {
        value: "ya",
        label: "Ya, saya mengetahui dan mengikuti aturan nya",
        score: 2,
      },
      {
        value: "tidak",
        label: "Tidak, saya tidak mengetahui dan tidak mengikuti aturan nya",
        score: 0,
      },
      {
        value: "proses",
        label: "Sedang Proses mengetahui nya",
        score: 1,
      },
    ],
    dependsOn: {
      questionId: "q14",
      requiredValue: "ya",
    },
  },
  {
    id: "q200_28",
    text: "28. Apakah kelompok Anda memiliki aturan tertulis yang melarang pekerja anak di bawah umur 15 tahun?",
    options: [
      {
        value: "ya",
        label: "Ya, saya memiliki aturan tertulis",
        score: 2,
      },
      {
        value: "tidak",
        label: "Tidak, saya tidak memiliki aturan tertulis",
        score: 0,
      },
      {
        value: "proses",
        label: "Sedang Proses membuat aturan tertulis",
        score: 1,
      },
    ],
    roleSpecific: "manajer",
  },
  {
    id: "q200_29",
    text: "29. Apakah aturan ini sudah disosialisasikan ke semua anggota?",
    options: [
      {
        value: "ya",
        label: "Ya, sudah disosialisasikan",
        score: 2,
      },
      {
        value: "tidak",
        label: "Tidak, belum disosialisasikan",
        score: 0,
      },
      {
        value: "proses",
        label: "Sedang Proses dan akan disosialisasikan",
        score: 1,
      },
    ],
    roleSpecific: "manajer",
  },
  {
    id: "q200_30",
    text: "30. Apakah Anda memeriksa secara rutin bahwa tidak ada pelanggaran (misal melalui kunjungan lapang)?",
    options: [
      {
        value: "ya",
        label: "Ya, sudah memeriksa secara rutin",
        score: 2,
      },
      {
        value: "tidak",
        label: "Tidak, belum memeriksa",
        score: 0,
      },
      {
        value: "proses",
        label: "Sedang Proses pemeriksaan",
        score: 1,
      },
    ],
    roleSpecific: "manajer",
  },
  {
    id: "q200_31",
    text: "31. Apakah pekerja di kebun Bapak/Ibu dibayar sesuai kesepakatan dan tidak kurang dari upah minimum yang berlaku?",
    options: [
      {
        value: "ya",
        label: "Ya, pekerja dibayar sesuai upah minimum yang berlaku",
        score: 2,
      },
      {
        value: "tidak",
        label: "Tidak, pekerja tidak dibayar sesuai upah minimum yang berlaku",
        score: 0,
      },
      {
        value: "proses",
        label: "Sedang proses membuat kesepakatan upah dengan pekerja",
        score: 1,
      },
    ],
    dependsOn: {
      questionId: "q16",
      requiredValue: "ya",
    },
  },
  {
    id: "q200_32",
    text: "32. Apakah semua pekerja, baik laki-laki maupun perempuan, dibayar dengan adil tanpa dibedakan?",
    options: [
      {
        value: "ya",
        label: "Ya, pekerja dibayar dengan adil",
        score: 2,
      },
      {
        value: "tidak",
        label: "Tidak, pekerja tidak dibayar dengan adil",
        score: 0,
      },
      {
        value: "proses",
        label: "Sedang proses membuat kesepakatan upah dengan pekerja",
        score: 1,
      },
    ],
    dependsOn: {
      questionId: "q16",
      requiredValue: "ya",
    },
  },
  {
    id: "q200_33",
    text: "33. Apakah Bapak/Ibu pernah mengikuti pelatihan tentang hak pekerja untuk menyampaikan keluhan atau pengaduan?",
    options: [
      {
        value: "ya",
        label: "Ya, Pernah mengikuti pelatihan",
        score: 2,
      },
      {
        value: "tidak",
        label: "Tidak Pernah mengikuti pelatihan",
        score: 0,
      },
      {
        value: "proses",
        label: "Sedang proses mengikuti pelatihan",
        score: 1,
      },
    ],
    dependsOn: {
      questionId: "q17",
      requiredValue: "ya",
    },
  },
  {
    id: "q200_34",
    text: "34. Apakah Bapak/Ibu sudah memberitahukan kepada pekerja di kebun tentang cara dan tempat menyampaikan keluhan, jika mereka memiliki masalah?",
    options: [
      {
        value: "ya",
        label: "Ya, sudah memberitahu kepada pekerja",
        score: 2,
      },
      {
        value: "tidak",
        label: "Tidak, Belum memberitahu kepada pekerja",
        score: 0,
      },
      {
        value: "proses",
        label: "Sedang proses memberitahu kepada pekerja",
        score: 1,
      },
    ],
    dependsOn: {
      questionId: "q17",
      requiredValue: "ya",
    },
  },
  {
    id: "q200_35",
    text: "35. Apakah Bapak/Ibu pernah mengikuti pelatihan tentang keselamatan kerja di kebun sawit, seperti cara aman menggunakan alat atau bahan kimia?",
    options: [
      {
        value: "ya",
        label:
          "Ya, mengikuti pelatihan tentang keselamatan kerja dikebun sawit",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, Belum mengikuti pelatihan tentang keselamatan kerja dikebun sawit",
        score: 0,
      },
      {
        value: "proses",
        label: "Sedang proses pendaftaran pelatihan",
        score: 1,
      },
    ],
  },
  {
    id: "q200_36",
    text: "36. Saat bekerja sendiri atau bersama pekerja, apakah Bapak/Ibu menggunakan alat pelindung seperti sarung tangan, masker, atau sepatu bot?",
    options: [
      {
        value: "ya",
        label: "Ya, saya menggunakan alat pelindung",
        score: 2,
      },
      {
        value: "tidak",
        label: "Tidak, saya tidak memakai alat pelindung",
        score: 0,
      },
      {
        value: "proses",
        label: "Sedang proses pembelian alat pelindung",
        score: 1,
      },
    ],
  },
  {
    id: "q200_37",
    text: "37. Jika ada pekerja di kebun, apakah Bapak/Ibu juga menyediakan alat pelindung yang sesuai untuk mereka?",
    options: [
      {
        value: "ya",
        label: "Ya, saya menyediakan alat pelindung yang sesuai untuk mereka",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, saya tidak menyediakan alat pelindung yang sesuai untuk mereka",
        score: 0,
      },
      {
        value: "proses",
        label: "Sedang proses pembelian alat pelindung",
        score: 1,
      },
    ],
  },
  {
    id: "q200_38",
    text: "38. Apakah Bapak/Ibu tahu bahaya apa saja yang bisa terjadi saat menggunakan pestisida, alat tajam, atau saat panen?",
    options: [
      {
        value: "ya",
        label: "Ya, saya mengetahui nya",
        score: 2,
      },
      {
        value: "tidak",
        label: "Tidak, saya tidak mengetahui resiko nya",
        score: 0,
      },
      {
        value: "proses",
        label: "Sedang proses pembelajaran materi",
        score: 1,
      },
    ],
  },
  {
    id: "q200_39",
    text: "39. Apakah Bapak/Ibu pernah ikut pelatihan atau penyuluhan yang membahas soal pencegahan diskriminasi, pelecehan, atau kekerasan terhadap pekerja?",
    options: [
      {
        value: "ya",
        label: "Ya, pernah mengikuti pelatihan/penyuluhan",
        score: 2,
      },
      {
        value: "tidak",
        label: "Tidak, tidak pernah mengikuti pelatihan/penyuluhan",
        score: 0,
      },
      {
        value: "proses",
        label: "Sedang proses pendaftaran pelatihan",
        score: 1,
      },
    ],
    dependsOn: {
      questionId: "q19",
      requiredValue: "ya",
    },
  },
  {
    id: "q200_40",
    text: "40. Setelah pelatihan atau penyuluhan tersebut, apakah Bapak/Ibu memahami pentingnya menciptakan lingkungan kerja yang aman dan saling menghormati, terutama bagi pekerja perempuan, anak muda, atau kelompok rentan lainnya?",
    options: [
      {
        value: "ya",
        label:
          "Ya, memahami pentingnya menciptakan lingkungan kerja yang aman dan saling menghormati",
        score: 2,
      },
      {
        value: "tidak",
        label: "Tidak, saya tidak memahami materi pelatihan",
        score: 0,
      },
      {
        value: "proses",
        label: "Sedang proses pendaftaran pelatihan",
        score: 1,
      },
    ],
    dependsOn: {
      questionId: "q19",
      requiredValue: "ya",
    },
  },
  {
    id: "q200_41",
    text: "41. Apakah Bapak/Ibu menerapkan hal-hal dari pelatihan tersebut dalam memperlakukan pekerja di kebun? Misalnya, dengan mencegah kekerasan, tidak membeda-bedakan perlakuan, dan memastikan mereka merasa aman?",
    options: [
      {
        value: "ya",
        label: "Ya, saya menerapkan hal-hal dari pelatihan",
        score: 2,
      },
      {
        value: "tidak",
        label: "Tidak, saya tidak menerapkan materi pelatihan",
        score: 0,
      },
      {
        value: "proses",
        label: "Sedang proses pendaftaran pelatihan",
        score: 1,
      },
    ],
    dependsOn: {
      questionId: "q19",
      requiredValue: "ya",
    },
  },
  {
    id: "q200_42",
    text: "42. Apakah Bapak/Ibu pernah mengikuti pelatihan atau sosialisasi tentang pentingnya menjaga hutan atau lahan yang punya nilai penting untuk alam, seperti HCV atau HCS?",
    options: [
      {
        value: "ya",
        label: "Ya, saya pernah mengikuti pelatihan",
        score: 2,
      },
      {
        value: "tidak",
        label: "Tidak, saya tidak pernah mengikuti pelatihan",
        score: 0,
      },
      {
        value: "proses",
        label: "Sedang proses pendaftaran pelatihan",
        score: 1,
      },
    ],
  },
  {
    id: "q200_43",
    text: "43. Apa yang Bapak/Ibu pahami sebagai area yang tidak boleh diganggu karena penting bagi alam (seperti sungai, hutan kecil, atau pohon besar)?",
    options: [
      {
        value: "ya",
        label: "Ya, saya paham bahwa itu bisa mengganggu keseimbangan alam",
        score: 2,
      },
      {
        value: "tidak",
        label: "Tidak, saya tidak mengerti",
        score: 0,
      },
      {
        value: "proses",
        label: "Sedang proses pembelajaran materi",
        score: 1,
      },
    ],
  },
  {
    id: "q200_44",
    text: "44. Apakah Bapak/Ibu tahu apa yang sebaiknya dilakukan jika ada hewan liar yang datang ke kebun? Misalnya babi, monyet, atau burung langka?",
    options: [
      {
        value: "ya",
        label: "Ya, saya mengetahui nya",
        score: 2,
      },
      {
        value: "tidak",
        label: "Tidak, saya tidak mengetahui",
        score: 0,
      },
      {
        value: "proses",
        label: "Sedang proses pembelajaran materi",
        score: 1,
      },
    ],
  },
  {
    id: "q200_45",
    text: "45. Apakah Bapak/Ibu pernah diberi tahu cara menangani hewan liar tanpa membahayakan mereka?",
    options: [
      {
        value: "ya",
        label: "Ya, saya mengetahui nya",
        score: 2,
      },
      {
        value: "tidak",
        label: "Tidak, saya tidak mengetahuinya",
        score: 0,
      },
      {
        value: "proses",
        label: "Sedang proses pembelajaran materi",
        score: 1,
      },
    ],
  },
  {
    id: "q200_46",
    text: "46. Apakah Bapak/Ibu tahu ada hewan atau tumbuhan langka di sekitar kebun, dan apakah Bapak/Ibu menjaga supaya mereka tidak terganggu?",
    options: [
      {
        value: "ya",
        label: "Ya, saya mengetahui nya",
        score: 2,
      },
      {
        value: "tidak",
        label: "Tidak, saya tidak mengetahuinya",
        score: 0,
      },
      {
        value: "proses",
        label: "Sedang proses pembelajaran materi",
        score: 1,
      },
    ],
  },
  {
    id: "q200_47",
    text: "47. Apakah Bapak/Ibu tahu jika lahan kebun sawit Bapak/Ibu dulu (sebelum ditanami) merupakan hutan atau lahan yang penting untuk lingkungan atau satwa liar?",
    options: [
      {
        value: "ya",
        label: "Ya, saya mengetahui nya",
        score: 2,
      },
      {
        value: "tidak",
        label: "Tidak, saya tidak mengetahui nya",
        score: 0,
      },
      {
        value: "proses",
        label: "Sedang proses pembelajaran materi",
        score: 1,
      },
    ],
  },
  {
    id: "q200_48",
    text: "48. Apakah Bapak/Ibu ikut dalam kegiatan kelompok yang membahas cara memperbaiki kembali hutan atau lahan penting yang pernah dibuka?",
    options: [
      {
        value: "ya",
        label: "Ya, saya mengikuti kegiatan kelompok",
        score: 2,
      },
      {
        value: "tidak",
        label: "Tidak, saya tidak mengikuti kegiatan kelompok",
        score: 0,
      },
      {
        value: "proses",
        label: "Sedang proses mencari dan mengikuti kegiatan",
        score: 1,
      },
    ],
  },
  {
    id: "q200_49",
    text: "49. Apakah Bapak/Ibu tahu bahwa kelompok sedang membuat rencana bersama untuk memperbaiki lahan yang dibuka sejak tahun 2005?",
    options: [
      {
        value: "ya",
        label: "Ya, saya mengetahuinya",
        score: 2,
      },
      {
        value: "tidak",
        label: "Tidak, saya tidak mengetahuinya",
        score: 0,
      },
      {
        value: "proses",
        label: "Sedang proses mencari dan mengikuti kegiatan",
        score: 1,
      },
    ],
  },
  {
    id: "q200_49",
    text: "49. Apakah Bapak/Ibu tahu bahaya apa saja yang bisa terjadi saat menggunakan pestisida, alat tajam, atau saat panen?",
    options: [
      {
        value: "ya",
        label: "Ya, saya mengetahui nya",
        score: 2,
      },
      {
        value: "tidak",
        label: "Tidak, saya tidak mengetahui resiko nya",
        score: 0,
      },
      {
        value: "proses",
        label: "Sedang proses pembelajaran materi",
        score: 1,
      },
    ],
  },
  {
    id: "q200_50",
    text: "50. Apakah kelompok petani memiliki catatan atau peta tentang lahan-lahan yang dibuka sejak tahun 2005 (terutama lahan dengan HCV atau HCS)?",
    options: [
      {
        value: "ya",
        label: "Ya, kelompok petani memiliki catatan/peta tentang lahan",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, kelompok petani tidak memiliki catatan/peta tentang lahan",
        score: 0,
      },
      {
        value: "proses",
        label: "Sedang Proses pencarian data catatan oleh kelompok petani",
        score: 1,
      },
    ],
    roleSpecific: "manajer",
  },
  {
    id: "q200_51",
    text: "51. Apakah kelompok telah menyusun rencana bersama petani untuk memulihkan kembali sebagian lahan tersebut?",
    options: [
      {
        value: "ya",
        label:
          "Ya, kelompok sudah menyusun rencana bersama petani untuk memulihkan kembali sebagian lahan",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, kelompok belum menyusun rencana bersama petani untuk memulihkan kembali sebagian lahan",
        score: 0,
      },
      {
        value: "proses",
        label:
          "Sedang Proses penyusunan rencana bersama petani untuk memulihkan kembali sebagian lahan",
        score: 1,
      },
    ],
    roleSpecific: "manajer",
  },
  {
    id: "q200_52",
    text: "52. Apakah rencana tersebut sudah dikirimkan atau dikonsultasikan ke RSPO?",
    options: [
      {
        value: "ya",
        label: "Ya, sudah dikirimkan/dikonsultasikan ke RSPO",
        score: 2,
      },
      {
        value: "tidak",
        label: "Tidak, belum dikirimkan/dikonsultasikan ke RSPO",
        score: 0,
      },
      {
        value: "proses",
        label: "Sedang Proses pengiriman/akan dikonsultasikan ke RSPO",
        score: 1,
      },
    ],
    roleSpecific: "manajer",
  },
  {
    id: "q200_53",
    text: "53. Apakah Bapak/Ibu dan kelompok petani sudah menyusun rencana bersama sebelum membuka lahan baru untuk sawit?",
    options: [
      {
        value: "ya",
        label: "Ya, saya sudah menyusun rencana bersama",
        score: 2,
      },
      {
        value: "tidak",
        label: "Tidak, saya belum menyusun rencana bersama",
        score: 0,
      },
      {
        value: "proses",
        label: "Sedang proses penyusunan",
        score: 1,
      },
    ],
  },
  {
    id: "q200_54",
    text: "54. Dalam rencana itu, apakah sudah dibahas cara menjaga atau melindungi kawasan penting seperti hutan atau tempat yang punya nilai penting bagi alam dan masyarakat (seperti hutan HCV dan HCS)?",
    options: [
      {
        value: "ya",
        label: "Ya, sudah dibahas",
        score: 2,
      },
      {
        value: "tidak",
        label: "Tidak, belum ada pembahasan tersebut",
        score: 0,
      },
      {
        value: "proses",
        label: "Sedang proses pembahasan",
        score: 1,
      },
    ],
  },
  {
    id: "q200_55",
    text: "55. Apakah rencana ini disusun secara bersama-sama, dengan melibatkan semua anggota kelompok yang berkepentingan?",
    options: [
      {
        value: "ya",
        label:
          "Ya, rencana ini disusun secara bersama-sama dengan melibatkan semua anggota kelompok yang berkepentingan",
        score: 2,
      },
      {
        value: "tidak",
        label: "Tidak, rencana ini tidak disusun secara bersama-sama",
        score: 0,
      },
      {
        value: "proses",
        label: "Sedang proses penyusunan",
        score: 1,
      },
    ],
  },
  {
    id: "q200_56",
    text: "56. Apakah kelompok pernah membantu petani menyusun rencana tanam baru secara bersama-sama sebelum lahan dibuka?",
    options: [
      {
        value: "ya",
        label:
          "Ya, pernah membantu petani menyusun rencana tanam baru bersama-sama",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, belum pernah membantu petani menyusun rencana tanam baru bersama-sama",
        score: 0,
      },
      {
        value: "proses",
        label:
          "Sedang Proses membantu petani menyusun rencana tanam baru bersama-sama",
        score: 1,
      },
    ],
  },
  {
    id: "q200_57",
    text: "57. Dalam rencana itu, apakah sudah dipastikan tidak ada hutan penting (seperti hutan lindung atau hutan bernilai konservasi tinggi) yang akan dibuka?",
    options: [
      {
        value: "ya",
        label: "Ya, sudah dipastikan tidak ada hutan penting",
        score: 2,
      },
      {
        value: "tidak",
        label: "Tidak, belum dipastikan tidak ada hutan penting",
        score: 0,
      },
      {
        value: "proses",
        label: "Sedang Proses memastikan tidak ada hutan penting",
        score: 1,
      },
    ],
    roleSpecific: "manajer",
  },
  {
    id: "q200_58",
    text: "58. Apakah proses penyusunan rencana ini dicatat atau didokumentasikan oleh kelompok sebelum petani mulai membuka lahan?",
    options: [
      {
        value: "ya",
        label:
          "Ya, proses penyusunan rencana ini dicatat dan didokumentasikan oleh kelompok sebelum petani mulai membuka lahan",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, proses penyusunan rencana ini belum dicatat dan didokumentasikan oleh kelompok sebelum petani mulai membuka lahan",
        score: 0,
      },
      {
        value: "proses",
        label:
          "Sedang Proses penyusunan rencana dan belum adanya pencatatan dan dokumentasi oleh kelompok",
        score: 1,
      },
    ],
    roleSpecific: "manajer",
  },
  {
    id: "q200_59",
    text: "59. Apakah Bapak/Ibu pernah ikut pelatihan tentang cara menanam sawit di tanah gambut, seperti bagaimana mengatur air dan mencegah kebakaran?",
    options: [
      {
        value: "ya",
        label:
          "Ya, saya pernah mengikuti pelatihan tentang cara menanam sawit di tanah gambut",
        score: 2,
      },
      {
        value: "proses",
        label: "Sedang Proses pendaftaran mengikuti pelatihan",
        score: 1,
      },
      {
        value: "tidak",
        label: "Tidak pernah mengikuti pelatihan",
        score: 0,
      },
    ],
    triggerSubQuestions: "ya",
    subQuestions: [
      {
        id: "q200_59_sub1",
        text: "59a. Apakah Bapak/Ibu sudah mulai menerapkan cara-cara yang diajarkan dalam pelatihan tersebut?",
        options: [
          {
            value: "ya",
            label:
              "Ya, Sudah menerapkan cara-cara yang diajarkan dalam pelatihan",
            score: 2,
          },
          {
            value: "proses",
            label: "Sedang Proses memahami materi pelatihan",
            score: 1,
          },
          {
            value: "tidak",
            label: "Tidak menerapkan cara-cara yang diajarkan dalam pelatihan",
            score: 0,
          },
        ],
      },
    ],
  },
  {
    id: "q200_60",
    text: "60. Apakah kelompok memiliki rencana atau panduan tertulis untuk membantu petani mengelola lahan gambut dengan aman dan mencegah kebakaran?",
    options: [
      {
        value: "ya",
        label:
          "Ya, kelompok memiliki rencana dan panduan tertulis untuk membantu petani mengelola lahan gambut",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, kelompok belum memiliki rencana dan panduan tertulis untuk membantu petani mengelola lahan gambut",
        score: 0,
      },
      {
        value: "proses",
        label:
          "Sedang Proses membuat rencana dan panduan tertulis untuk membantu petani mengelola lahan gambut",
        score: 1,
      },
    ],
    roleSpecific: "manajer",
  },
  {
    id: "q200_61",
    text: "61. Apakah kelompok memantau atau mendampingi petani dalam menerapkan rencana tersebut, terutama soal pengaturan air dan pengendalian kebakaran?",
    options: [
      {
        value: "ya",
        label:
          "Ya, kelompok memantau dan mendampingi petani dalam menerapkan rencana tersebut",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, kelompok tidak memantau dan mendampingi petani dalam menerapkan rencana tersebut",
        score: 0,
      },
      {
        value: "proses",
        label:
          "Sedang Proses memantau dan mendampingi petani dalam menerapkan rencana tersebut",
        score: 1,
      },
    ],
    roleSpecific: "manajer",
  },
  {
    id: "q200_62",
    text: "62. Apakah kelompok memiliki sistem atau kegiatan khusus untuk memantau dan mengatur air di lahan gambut milik petani?",
    options: [
      {
        value: "ya",
        label:
          "Ya, kelompok memiliki sistem atau kegiatan khusus untuk memantau dan mengatur air dilahan gambut milik petani",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, kelompok belum memiliki sistem atau kegiatan khusus untuk memantau dan mengatur air dilahan gambut milik petani",
        score: 0,
      },
      {
        value: "proses",
        label:
          "Sedang Proses mmembuat sistem atau kegiatan khusus untuk memantau dan mengatur air dilahan gambut milik petani",
        score: 1,
      },
    ],
    roleSpecific: "manajer",
  },
  {
    id: "q200_63",
    text: "63. Apakah Bapak/Ibu memiliki rencana untuk menanam ulang di lahan gambut?",
    options: [
      {
        value: "ya",
        label: "Ya, saya memiliki rencana untuk menanam ulang di lahan gambut",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, saya tidak memiliki rencana untuk menanam ulang di lahan gambut",
        score: 0,
      },
      {
        value: "proses",
        label:
          "Sedang proses menimbang untuk rencana menanam ulang di lahan gambut",
        score: 1,
      },
    ],
    dependsOn: {
      questionId: "q24",
      requiredValue: "ya",
    },
  },
  {
    id: "q200_64",
    text: "64. Apakah Bapak/Ibu pernah mengikuti pelatihan yang membahas risiko banjir atau air asin (salinitas) di lahan gambut?",
    options: [
      {
        value: "ya",
        label:
          "Ya, saya pernah mengikuti pelatihan yang membahas resiko banjir atau air asin (salinitas) di lahan gambut",
        score: 2,
      },
      {
        value: "tidak",
        label: "Tidak, saya tidak pernah mengikuti pelatihan",
        score: 0,
      },
      {
        value: "proses",
        label: "Sedang proses pendaftaran pelatihan",
        score: 1,
      },
    ],
    dependsOn: {
      questionId: "q24",
      requiredValue: "ya",
    },
  },
  {
    id: "q200_65",
    text: "65. Apakah dalam pelatihan tersebut juga dijelaskan alternatif cara lain untuk memanfaatkan lahan jika terjadi risiko tinggi?",
    options: [
      {
        value: "ya",
        label:
          "Ya, dalam pelatihan terdapat materi alternatif cara lain memanfaatkan lahan jika terjadi resiko tinggi",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, dalam pelatihan tidak dijelaskan materi alternatif cara lain memanfaatkan lahan jika terjadi resiko tinggi",
        score: 0,
      },
      {
        value: "proses",
        label: "Sedang proses memahami materi pelatihan",
        score: 1,
      },
    ],
    dependsOn: {
      questionId: "q24",
      requiredValue: "ya",
    },
  },
  {
    id: "q200_66",
    text: "66. Apakah kelompok memfasilitasi pelatihan kepada petani tentang risiko banjir dan salinitas di lahan gambut?",
    options: [
      {
        value: "ya",
        label:
          "Ya, kelompok memfasilitasi pelatihan kepada petani tentang resiko banjir dan salinitas dilahan gambut",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, kelompok belum memfasilitasi pelatihan kepada petani tentang resiko banjir dan salinitas dilahan gambut",
        score: 0,
      },
      {
        value: "proses",
        label:
          "Sedang Proses rencana memfasilitasi pelatihan kepada petani tentang resiko banjir dan salinitas dilahan gambut",
        score: 1,
      },
    ],
    roleSpecific: "manajer",
  },
  {
    id: "q200_67",
    text: "67. Apakah kelompok memberikan informasi atau pendampingan kepada petani tentang pilihan pengelolaan lahan lain selain sawit di lahan gambut?",
    options: [
      {
        value: "ya",
        label:
          "Ya, kelompok menginformasikan dan mendampingi petani tentang pilihan pengelolaan lahan lain selain sawit dilahan gambut",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, kelompok belum menginformasikan dan mendampingi petani tentang pilihan pengelolaan lahan lain selain sawit dilahan gambut",
        score: 0,
      },
      {
        value: "proses",
        label:
          "Sedang Proses menginformasikan dan mendampingi petani tentang pilihan pengelolaan lahan lain selain sawit dilahan gambut",
        score: 1,
      },
    ],
    roleSpecific: "manajer",
  },
  {
    id: "q200_68",
    text: "68. Apakah Bapak/Ibu pernah mengikuti pelatihan atau sosialisasi tentang cara membuka lahan dan mengelola kebun tanpa membakar?",
    options: [
      {
        value: "ya",
        label:
          "Ya, saya pernah mengikuti pelatihan atau sosialisasi tentang cara membuka lahan dan mengelola kebun tanpa membakar",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, saya belum pernah mengikuti pelatihan atau sosialiasi tentang cara membuka lahan dan mengelola kebun tanpa membakar",
        score: 0,
      },
      {
        value: "proses",
        label: "Sedang Proses merencanakan mengikuti pelatihan",
        score: 1,
      },
    ],
  },
  {
    id: "q200_69",
    text: "69. Apakah Bapak/Ibu mengetahui cara mencegah kebakaran dan apa yang harus dilakukan jika terjadi kebakaran di sekitar kebun atau desa?",
    options: [
      {
        value: "ya",
        label: "Ya, saya mengetahui cara mencegah dan apa yang harus dilakukan",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, saya tidak mengetahui cara mencegah dan apa yang harus dilakukan",
        score: 0,
      },
      {
        value: "proses",
        label:
          "Sedang Proses mempelajari cara mencegah dan apa yang harus dilakukan",
        score: 1,
      },
    ],
  },
  {
    id: "q200_70",
    text: "70. Setelah bergabung dalam kelompok ini, apakah Bapak/Ibu masih menggunakan api untuk membuka lahan atau mengendalikan hama?",
    options: [
      {
        value: "ya",
        label: "Ya, masih",
        score: 2,
      },
      {
        value: "tidak",
        label: "Tidak",
        score: 0,
      },
      {
        value: "proses",
        label: "Sedang proses merencanakan tidak menggunakan api",
        score: 1,
      },
    ],
  },
  {
    id: "q200_71",
    text: "71. Apakah kelompok mencatat atau memantau adanya penggunaan api oleh petani setelah mereka bergabung dalam kelompok?",
    options: [
      {
        value: "ya",
        label:
          "Ya, kelompok mencatat atau memantau adanya penggunaan api oleh petani",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, kelompok belum mencatat atau memantau adanya penggunaan api oleh petani",
        score: 0,
      },
      {
        value: "proses",
        label:
          "Sedang Proses merencanakan untuk mencatat atau memantau adanya penggunaan api oleh petani",
        score: 1,
      },
    ],
    roleSpecific: "manajer",
  },
  {
    id: "q200_72",
    text: "72. Apakah kelompok menyelenggarakan pelatihan atau sosialisasi kepada anggota tentang pencegahan dan penanggulangan kebakaran?",
    options: [
      {
        value: "ya",
        label:
          "Ya, menyelenggarakan pelatihan/sosialisasi kepada anggota tentang pencegahan dan penanggulangan kebakaran",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak ada menyelenggarakan pelatihan/sosialisasi kepada anggota tentang pencegahan dan penanggulangan kebakaran",
        score: 0,
      },
      {
        value: "proses",
        label:
          "Sedang Proses merencanakan menyelenggarakan pelatihan/sosialisasi kepada anggota tentang pencegahan dan penanggulangan kebakaran",
        score: 1,
      },
    ],
    roleSpecific: "manajer",
  },
  {
    id: "q200_73",
    text: "73. Apakah Bapak/Ibu tahu apa itu zona penyangga sungai dan bagaimana cara menjaganya?",
    options: [
      {
        value: "ya",
        label: "Ya, saya mengetahui ",
        score: 2,
      },
      {
        value: "tidak",
        label: "Tidak saya tidak mengetahui",
        score: 0,
      },
      {
        value: "proses",
        label: "Sedang Proses memahami materi",
        score: 1,
      },
    ],
  },
  {
    id: "q200_74",
    text: "74. Apakah Bapak/Ibu pernah mengikuti pelatihan atau sosialisasi terkait pengelolaan zona penyangga sungai?",
    options: [
      {
        value: "ya",
        label:
          "Ya, saya pernah mengikuti pelatihan/sosialisasi terkait pengelolaan zona penyangga sungai",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, saya tidak pernah mengikuti pelatihan/sosialisasi terkait pengelolaan zona penyangga sungai",
        score: 0,
      },
      {
        value: "proses",
        label: "Sedang Proses pendaftaran untuk mengikuti pelatihan",
        score: 1,
      },
    ],
  },
  {
    id: "q200_75",
    text: "75. Apakah kelompok memiliki rencana atau panduan tertulis untuk menjaga atau memperbaiki kondisi zona penyangga sungai di sekitar lahan petani?",
    options: [
      {
        value: "ya",
        label:
          "Ya, kelompok memiliki rencana atau panduan tertulis untuk menjaga atau memperbaiki kondisi zona penyangga sungai",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, kelompok tidak memiliki rencana atau panduan tertulis untuk menjaga atau memperbaiki kondisi zona penyangga sungai",
        score: 0,
      },
      {
        value: "proses",
        label:
          "Sedang Proses merencanakan untuk membuat panduan tertulis untuk menjaga/memperbaiki kondisi zona penyangga sungai",
        score: 1,
      },
    ],
    roleSpecific: "manajer",
  },
  {
    id: "q200_76",
    text: "76. Apakah kelompok sudah menyampaikan dan mendiskusikan rencana tersebut dengan para anggota?",
    options: [
      {
        value: "ya",
        label:
          "Ya, sudah menyampaikan dan mendiskusikan rencana tersebut dengan para anggota",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, belum ada penyampaian dan mendiskusikan rencana tersebut dengan para anggota",
        score: 0,
      },
      {
        value: "proses",
        label:
          "Sedang Proses merencanakan penyampaian dan mendiskusikan rencana tersebut dengan para anggota",
        score: 1,
      },
    ],
    roleSpecific: "manajer",
  },
  {
    id: "q200_77",
    text: "77. Apakah Bapak/Ibu pernah mendapat pelatihan tentang penggunaan pestisida yang aman dan cara penyimpanan serta pembuangannya?",
    options: [
      {
        value: "ya",
        label:
          "Ya, saya pernah mendapatkan pelatihan tentang penggunaan pestisida",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, saya belum pernah mendapatkan pelatihan tentang penggunaan pestisida",
        score: 0,
      },
      {
        value: "proses",
        label: "Sedang Proses mendaftar pelatihan tentang penggunaan pestisida",
        score: 1,
      },
    ],
  },
  {
    id: "q200_78",
    text: "78. Apakah Bapak/Ibu mengetahui bahwa beberapa pestisida seperti paraquat atau yang termasuk daftar berbahaya dilarang dipakai?",
    options: [
      {
        value: "ya",
        label: "Ya, saya sudah mengetahui nya",
        score: 2,
      },
      {
        value: "tidak",
        label: "Tidak, saya belum mengetahuinya",
        score: 0,
      },
      {
        value: "proses",
        label: "Sedang Proses memahami materi pelatihan",
        score: 1,
      },
    ],
  },
  {
    id: "q200_79",
    text: "79. Apakah Bapak/Ibu tahu bahwa ibu hamil, menyusui, dan anak muda tidak boleh terpapar pestisida di kebun?",
    options: [
      {
        value: "ya",
        label: "Ya, saya sudah mengetahui nya",
        score: 2,
      },
      {
        value: "tidak",
        label: "Tidak, saya belum mengetahui nya",
        score: 0,
      },
      {
        value: "proses",
        label: "Sedang Proses memahami materi pelatihan",
        score: 1,
      },
    ],
  },
  {
    id: "q200_80",
    text: "80. Apakah kelompok pernah menyelenggarakan atau memfasilitasi pelatihan tentang penggunaan pestisida yang aman bagi anggotanya?",
    options: [
      {
        value: "ya",
        label:
          "Ya, kelompok pernah menyelenggarakan atau memfasilitasi pelatihan tentang penggunaan pestisida yang aman",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, kelompok tidak pernah menyelenggarakan atau memfasilitasi pelatihan tentang penggunaan pestisida yang aman",
        score: 0,
      },
      {
        value: "proses",
        label:
          "Sedang Proses merencanakan menyelenggarakan pelatihan tentang penggunaan pestisida yang aman",
        score: 1,
      },
    ],
    roleSpecific: "manajer",
  },
  {
    id: "q200_81",
    text: "81. Apakah kelompok mencatat atau memantau jenis pestisida yang digunakan oleh petani dan memastikan tidak menggunakan yang dilarang?",
    options: [
      {
        value: "ya",
        label:
          "Ya, kelompok mencatat dan memantau jenis pestisida yang digunakan oleh petani",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, kelompok belum mencatat dan memantau jenis pestisida yang digunakan oleh petani",
        score: 0,
      },
      {
        value: "proses",
        label:
          "Sedang Proses merencanakan untuk mencatat dan memantau jenis pestisida yang digunakan oleh petani",
        score: 1,
      },
    ],
    roleSpecific: "manajer",
  },
  {
    id: "q200_82",
    text: "82. Apakah Bapak/Ibu pernah mengikuti pelatihan tentang cara mengelola hama, gulma, dan tanaman pengganggu lainnya secara aman dan ramah lingkungan?",
    options: [
      {
        value: "ya",
        label:
          "Ya, saya pernah mengikuti pelatihan tentang cara mengelola hama, gulma dan tanaman pengganggu lainnya",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, saya tidak pernah mengikuti pelatihan tentang cara mengelola hama, gulma dan tanaman pengganggu lainnya",
        score: 0,
      },
      {
        value: "proses",
        label:
          "Sedang prose pendaftaran pelatihan tentang cara mengelola hama, gulma dan tanaman pengganggu lainnya",
        score: 1,
      },
    ],
  },
  {
    id: "q200_83",
    text: "83. Apakah Bapak/Ibu mengetahui bahwa ada cara mengendalikan hama tanpa harus selalu menggunakan pestisida (seperti IPM atau pengendalian terpadu)?",
    options: [
      {
        value: "ya",
        label: "Ya, saya mengetahui nya",
        score: 2,
      },
      {
        value: "tidak",
        label: "Tidak, saya tidak mengetahui nya",
        score: 0,
      },
      {
        value: "proses",
        label: "Sedang Proses memahami materi",
        score: 1,
      },
    ],
  },
  {
    id: "q200_84",
    text: "84. Apakah kelompok pernah memfasilitasi pelatihan kepada anggota terkait pengendalian hama terpadu (IPM) dan penggunaan bahan kimia yang aman?",
    options: [
      {
        value: "ya",
        label:
          "Ya, kelompok pernah memfasilitasi pelatihan kepada anggota terkait pengendalian hama terpadu (IPM) dan penggunaan bahan kimia yang aman",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, kelompok tidak pernah memfasilitasi pelatihan kepada anggota terkait pengendalian hama terpadu (IPM) dan penggunaan bahan kimia yang aman",
        score: 0,
      },
      {
        value: "proses",
        label:
          "Sedang Proses merencanakan untuk memfasilitasi pelatihan kepada anggota terkait pengendalian hama terpadu (IPM) dan penggunaan bahan kimia",
        score: 1,
      },
    ],
    roleSpecific: "manajer",
  },
  {
    id: "q200_85",
    text: "85. Apakah kelompok menyimpan atau memiliki materi pelatihan atau panduan untuk praktik pengendalian gulma dan tanaman pengganggu yang aman?",
    options: [
      {
        value: "ya",
        label: "Ya, kelompok menyimpan dan memiliki materi pelatihan",
        score: 2,
      },
      {
        value: "tidak",
        label: "Tidak, kelompok tidak menyimpan dan memiliki materi pelatihan",
        score: 0,
      },
      {
        value: "proses",
        label: "Sedang Proses menyimpan materi pelatihan",
        score: 1,
      },
    ],
    roleSpecific: "manajer",
  },
];

export const stage3Questions: Question[] = [
  {
    id: "q300_1",
    text: "Apakah kelompok Bapak/Ibu membuat keputusan penting melalui musyawarah dan disepakati bersama oleh anggota secara terbuka dan adil?",
    options: [
      {
        value: "konsisten",
        label:
          "Ya, keputusan penting diperoleh melalui musyawarah dan disepakati bersama oleh anggota secara terbuka dan adil",
        score: 2,
      },
      {
        value: "kadang",
        label: "Sedang proses membangun musyawarah secara terbuka dan adil",
        score: 1,
      },
      {
        value: "tidak",
        label:
          "Tidak, keputusan penting tidak melalui musyawarah dan disepakati bersama oleh anggota secara terbuka dan adil",
        score: 0,
      },
    ],
    roleSpecific: "manajer",
  },
  {
    id: "q300_2",
    text: "Apakah kelompok memiliki sistem keuangan yang dicatat dengan baik, transparan, dan mampu menjaga keuangan kelompok tetap berjalan dalam jangka panjang?",
    options: [
      {
        value: "memiliki_sistem_keuangan",
        label:
          "Ya, kelompok memiliki sistem keuangan yang dicatat dengan baik, transparan dan mampu menjaga keuangan kelompok tetap berjalan",
        score: 2,
      },
      {
        value: "proses_memiliki",
        label:
          "Sedang proses memiliki sistem keuangan yang dicatat dengan baik, transparan dan mampu menjaga keuangan kelompok tetap berjalan",
        score: 1,
      },
      {
        value: "tidak_memiliki",
        label:
          "Tidak, kelompok tidak memiliki sistem keuangan yang dicatat dengan baik, transparan dan mampu menjaga keuangan kelompok tetap berjalan",
        score: 0,
      },
    ],
    roleSpecific: "manajer",
  },
  {
    id: "q300_3",
    text: "Apakah Bapak/Ibu mencatat hasil panen TBS dari kebun secara rutin (misalnya setiap panen)?",
    options: [
      {
        value: "aktif",
        label: "Ya, saya mencatat hasil panen TBS dari kebun secara rutin",
        score: 2,
      },
      {
        value: "kadang",
        label:
          "Sedang proses mulai mencatat hasil panen TBS dari kebun secara rutin",
        score: 1,
      },
      {
        value: "tidak",
        label:
          "Tidak, saya tidak pernah mencatat hasil panen TBS dari kebun secara rutin",
        score: 0,
      },
    ],
  },
  {
    id: "q300_4",
    text: "Apakah Bapak/Ibu mencatat semua transaksi penjualan TBS, termasuk jumlah dan harga jualnya?",
    options: [
      {
        value: "ya",
        label: "Ya, saya mencatat transaksi penjualan TBS",
        score: 2,
      },
      {
        value: "mungkin",
        label: "Kadang saya mencatat transaksi penjualan TBS",
        score: 1,
      },
      {
        value: "tidak",
        label: "Tidak, saya tidak mencatat transaksi penjualan TBS",
        score: 0,
      },
    ],
  },
  {
    id: "q300_5",
    text: "Apakah Bapak/Ibu menggunakan catatan hasil panen dan penjualan tersebut untuk membantu mengelola dan merencanakan kegiatan kebun?",
    options: [
      {
        value: "ya",
        label:
          "Ya, saya menggunakan catatan hasil panen dan penjualan tersebut untuk membantu mengelola dan merencanakan kegiatan kebun",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, saya tidak pernah menggunakan catatan hasil panen dan penjualan tersebut untuk membantu mengelola dan merencanakan kegiatan kebun",
        score: 0,
      },
      {
        value: "sedang proses",
        label:
          "Terkadang saya menggunakan catatan hasil panen dan penjualan tersebut untuk membantu mengelola dan merencanakan kegiatan kebun",
        score: 1,
      },
    ],
  },
  {
    id: "q300_6",
    text: "Apakah Bapak/Ibu sudah mulai menerapkan praktik-praktik pertanian yang baik di kebun, seperti pemupukan tepat, perawatan tanaman, dan pengendalian gulma secara rutin?",
    options: [
      {
        value: "ya",
        label:
          "Ya, saya sudah mulai menerapkan praktik-praktik pertanian yang baik di kebun",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, saya belum menerapkan praktik-praktik pertanian yang baik di kebun",
        score: 0,
      },
      {
        value: "sedang proses",
        label:
          "Terkadang saya menerapkan praktik-praktik pertanian yang baik di kebun",
        score: 1,
      },
    ],
  },
  {
    id: "q300_7",
    text: "Apakah Bapak/Ibu mencatat hasil panen penjualan TBS dari kebun secara teratur?",
    options: [
      {
        value: "ya",
        label:
          "Ya, saya mencatat hasil panen dan penjualan TBS dari kebun secara teratur",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, saya tidak pernah mencatat hasil panen dan penjualan TBS dari kebun secara teratur",
        score: 0,
      },
      {
        value: "sedang proses",
        label:
          "Terkadang saya mencatat hasil panen dan penjualan TBS dari kebun secara teratur",
        score: 1,
      },
    ],
  },
  {
    id: "q300_8",
    text: "Apakah batas lahan kebun Bapak/Ibu sudah ditandai dengan jelas dan terlihat di lapangan, dan Bapak/Ibu hanya bekerja di dalam batas tersebut?",
    options: [
      {
        value: "ya",
        label:
          "Ya, batas lahan sudah ditandai dengan jelas dan terlihat di lapangan",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, batas lahan belum ditandai dengan jelas dan terlihat di lapangan",
        score: 0,
      },
      {
        value: "sedang proses",
        label: "Sedang proses membuat tanda batas lahan",
        score: 1,
      },
    ],
  },
  {
    id: "q300_9",
    text: "Apakah Bapak/Ibu pernah berdiskusi atau bermusyawarah dengan masyarakat sekitar, masyarakat adat, atau pihak lain yang sebelumnya menggunakan lahan tersebut sebelum membuka kebun baru?",
    options: [
      {
        value: "ya",
        label:
          "Ya, saya pernah berdiskusi atau bermusyawarah dengan masyarakat sekitar/adat/pihak lain sebelum membuka kebun baru",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, saya tidak pernah berdiskusi atau bermusyawarah dengan masyarakat sekitar/adat/pihak lain sebelum membuka kebun baru",
        score: 0,
      },
      {
        value: "sedang proses",
        label:
          "Sedang proses berdiskusi dengan masyarakat sekitar/adat/pihak lain sebelum membuka kebun baru",
        score: 1,
      },
    ],
  },
  {
    id: "q300_10",
    text: "Apakah Bapak/Ibu bersama pihak-pihak tersebut telah membuat kesepakatan atau rencana bersama sebelum membuka lahan sawit baru, terutama jika lahan tersebut dulunya digunakan untuk hal lain (misalnya hutan, ladang, atau permukiman)?",
    options: [
      {
        value: "ya",
        label:
          "Ya, saya telah membuat kesepakatan atau rencana bersama sebelum membuka lahan sawit baru",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, saya belum membuat kesepakatan atau rencana bersama sebelum membuka lahan sawit baru",
        score: 0,
      },
      {
        value: "sedang proses",
        label:
          "Sedang proses membuat kesepakatan atau rencana bersama sebelum membuka lahan sawit baru",
        score: 1,
      },
    ],
  },
  {
    id: "q300_11",
    text: "Apakah kelompok telah memfasilitasi proses diskusi dan persetujuan bersama (musyawarah) antara petani dan masyarakat yang terdampak sebelum pembukaan lahan baru?",
    options: [
      {
        value: "ya",
        label:
          "Ya, kelompok telah memfasilitasi proses diskusi dan musyawarag antara petani dan masyarakat yang terdampak",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, kelompok belum memfasilitasi proses diskusi dan musyawarag antara petani dan masyarakat yang terdampak",
        score: 0,
      },
      {
        value: "sedang proses",
        label:
          "Sedang proses memfasilitasi proses diskusi dan musyawarag antara petani dan masyarakat yang terdampak",
        score: 1,
      },
    ],
    roleSpecific: "manajer",
  },
  {
    id: "q300_12",
    text: "Apakah pekerja di kebun Bapak/Ibu menyimpan sendiri dokumen identitas mereka (misalnya KTP, KK, atau dokumen lainnya)?",
    options: [
      {
        value: "ya",
        label: "Ya, menyimpan sendiri dokumen identitas mereka",
        score: 2,
      },
      {
        value: "tidak",
        label: "Tidak menyimpan sendiri dokumen identitas mereka",
        score: 0,
      },
      {
        value: "sedang proses",
        label: "Sedang merencanakan proses menyimpan dokumen identitas mereka",
        score: 1,
      },
    ],
    dependsOn: {
      questionId: "q14",
      requiredValue: "ya",
    },
  },
  {
    id: "q300_13",
    text: "Apakah pekerja bebas pergi ke mana saja di luar jam kerja tanpa harus meminta izin atau pengawasan?",
    options: [
      {
        value: "ya",
        label:
          "Ya, pekerja bebas pergi kemana saja di luar jam kerja tanpa harus meminta izin atau pengawasan",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, pekerja tidak bebas pergi kemana saja diluar jam kerja dan harus meminta izin atau pengawasan",
        score: 0,
      },
      {
        value: "sedang proses",
        label:
          "Terkadang pekerja bebas pergi kemana saja diluar jam kerja dan harus meminta izin atau pengawasan",
        score: 1,
      },
    ],
    dependsOn: {
      questionId: "q14",
      requiredValue: "ya",
    },
  },
  {
    id: "q300_14",
    text: "Apakah pekerja mengatakan bahwa mereka bekerja secara sukarela dan tidak dipaksa?",
    options: [
      {
        value: "ya",
        label:
          "Ya, pekerja mengatakan bahwa mereka bekerja secara sukarela dan tidak dipaksa",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, pekerja tidak mengatakan bahwa mereka bekerja secara sukarela dan tidak dipaksa",
        score: 0,
      },
      {
        value: "sedang proses",
        label:
          "Terkadang pekerja mengatakan bahwa mereka bekerja secara sukarela dan tidak dipaksa",
        score: 1,
      },
    ],
    dependsOn: {
      questionId: "q14",
      requiredValue: "ya",
    },
  },
  {
    id: "q300_15",
    text: "Apakah pekerja di kebun Bapak/Ibu menerima upah sesuai dengan yang sudah disepakati dan minimal sesuai upah minimum yang berlaku?",
    options: [
      {
        value: "ya",
        label:
          "Ya, pekerja menerima upah sesuai dengan yang sudah disepakati dan minimal sesuai upah minumum yang berlaku",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, pekerja tidak menerima upah sesuai dengan yang sudah disepakati dan minimal sesuai upah minumum yang berlaku",
        score: 0,
      },
      {
        value: "sedang proses",
        label:
          "Terkadang pekerja menerima upah sesuai dengan yang sudah disepakati dan minimal sesuai upah minumum yang berlaku",
        score: 1,
      },
    ],
    dependsOn: {
      questionId: "q16",
      requiredValue: "ya",
    },
  },
  {
    id: "q300_16",
    text: "Apakah Bapak/Ibu memberikan upah dan perlakuan yang adil kepada semua pekerja, termasuk perempuan dan kelompok rentan lainnya?",
    options: [
      {
        value: "ya",
        label:
          "Ya, saya memberikan upah dan perlakuan yang adil kepada semua pekerja, termasuk perempuan dan kelompok rentan lainnya",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, saya tidak memberikan upah dan perlakuan yang adil kepada semua pekerja, termasuk perempuan dan kelompok rentan lainnya",
        score: 0,
      },
      {
        value: "sedang proses",
        label:
          "Terkadang memberikan upah dan perlakuan yang adil kepada semua pekerja, termasuk perempuan dan kelompok rentan lainnya",
        score: 1,
      },
    ],
    dependsOn: {
      questionId: "q16",
      requiredValue: "ya",
    },
  },
  {
    id: "q300_17",
    text: "Apakah ada perbedaan jumlah upah antara pekerja laki-laki dan perempuan untuk jenis pekerjaan yang sama?",
    options: [
      {
        value: "ya",
        label:
          "Ya, terdapat perbedaan upah antara pekerja laki-laki dan perempuan untuk jenis pekerjaan yang sama",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, tidak terdapat perbedaan upah antara pekerja laki-laki dan perempuan untuk jenis pekerjaan yang sama",
        score: 0,
      },
      {
        value: "sedang proses",
        label:
          "Terkadang pekerja mendapat perbedaan upah antara pekerja laki-laki dan perempuan untuk jenis pekerjaan yang sama",
        score: 1,
      },
    ],
    dependsOn: {
      questionId: "q16",
      requiredValue: "ya",
    },
  },
  {
    id: "q300_18",
    text: "Apakah pekerja di kebun Anda tahu ke mana harus mengadu jika mereka punya masalah di tempat kerja?",
    options: [
      {
        value: "ya",
        label:
          "Ya, pekerja mengetahui kemana harus mengadu jika mereka punya masalah di tempat kerja",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, pekerja tidak mengetahui kemana harus mengadu jika mereka punya masalah di tempat kerja",
        score: 0,
      },
      {
        value: "sedang proses",
        label:
          "Sedang proses memberitahu pekerja kemana harus mengadu jika mereka punya masalah di tempat kerja",
        score: 1,
      },
    ],
    dependsOn: {
      questionId: "q17",
      requiredValue: "ya",
    },
  },
  {
    id: "q300_19",
    text: "Apakah sudah ada cara atau prosedur yang jelas bagi pekerja untuk menyampaikan keluhan, misalnya lewat kotak saran, pertemuan rutin, atau orang yang bisa dipercaya?",
    options: [
      {
        value: "ya",
        label:
          "Ya, sudah ada cara atau prosedur yang jelas bagi pekerja untuk menyampaikan keluhan",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak ada cara atau prosedur yang jelas bagi pekerja untuk menyampaikan keluhan",
        score: 0,
      },
      {
        value: "sedang proses",
        label:
          "Sedang proses membuat cara atau prosedur yang jelas bagi pekerja untuk menyampaikan keluhan",
        score: 1,
      },
    ],
    dependsOn: {
      questionId: "q17",
      requiredValue: "ya",
    },
  },
  {
    id: "q300_20",
    text: "Apakah pekerja dan anggota keluarga yang bekerja di kebun memiliki tempat tinggal yang aman dan layak (jika diperlukan)?",
    options: [
      {
        value: "ya",
        label: "Ya, pekerja memiliki tempat tinggal yang aman dan layak",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, pekerja tidak memiliki tempat tinggal yang aman dan layak",
        score: 0,
      },
      {
        value: "sedang proses",
        label:
          "Sedang proses membangun tempat tinggal yang aman dan layak bagi pekerja",
        score: 1,
      },
    ],
    dependsOn: {
      questionId: "q14",
      requiredValue: "ya",
    },
  },
  {
    id: "q300_21",
    text: "Apakah tersedia kotak P3K (pertolongan pertama) di kebun atau tempat kerja?",
    options: [
      {
        value: "ya",
        label: "Ya, tersedia kotak P3K",
        score: 2,
      },
      {
        value: "tidak",
        label: "Tidak tersedia kotak P3K",
        score: 0,
      },
      {
        value: "sedang proses",
        label: "Sedang proses membeli kotak P3K",
        score: 1,
      },
    ],
    dependsOn: {
      questionId: "q14",
      requiredValue: "ya",
    },
  },
  {
    id: "q300_22",
    text: "Apakah pekerja menggunakan alat pelindung diri (APD) seperti sarung tangan, masker, sepatu bot, saat melakukan pekerjaan berisiko?",
    options: [
      {
        value: "ya",
        label: "Ya, pekerja menggunakan alat pelindung diri (APD)",
        score: 2,
      },
      {
        value: "tidak",
        label: "Tidak, pekerja tidak menggunakan alat pelindung diri (APD)",
        score: 0,
      },
      {
        value: "sedang proses",
        label: "Sedang proses membeli alat pelindung diri (APD)",
        score: 1,
      },
    ],
    dependsOn: {
      questionId: "q14",
      requiredValue: "ya",
    },
  },
  {
    id: "q300_23",
    text: "Apakah tersedia air minum yang cukup dan bersih untuk pekerja di kebun?",
    options: [
      {
        value: "ya",
        label:
          "Ya, tersedia air minum yang cukup dan bersih untuk pekerja di kebun",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak tersedia air minum yang cukup dan bersih untuk pekerja di kebun",
        score: 0,
      },
      {
        value: "sedang proses",
        label:
          "Sedang proses membuat air minum yang cukup dan bersih untuk pekerja di kebun",
        score: 1,
      },
    ],
    dependsOn: {
      questionId: "q14",
      requiredValue: "ya",
    },
  },
  {
    id: "q300_24",
    text: "Apakah pekerja memiliki akses ke toilet yang layak?",
    options: [
      {
        value: "ya",
        label: "Ya, pekerja memiliki akses ke toilet yang layak",
        score: 2,
      },
      {
        value: "tidak",
        label: "Tidak, pekerja tidak memiliki akses ke toilet yang layak",
        score: 0,
      },
      {
        value: "sedang proses",
        label: "Sedang proses membuat akses toilet yang layak",
        score: 1,
      },
    ],
    dependsOn: {
      questionId: "q14",
      requiredValue: "ya",
    },
  },
  {
    id: "q300_25",
    text: "Apakah Anda mengetahui bahwa para petani anggota menyediakan tempat tinggal layak (jika diperlukan) bagi pekerja mereka?",
    options: [
      {
        value: "ya",
        label:
          "Ya, saya mengetahui bahwa para petani anggota menyediakan tempat tinggal layak bagi pekerja mereka",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, saya tidak mengetahui bahwa para petani anggota menyediakan tempat tinggal layak bagi pekerja mereka",
        score: 0,
      },
      {
        value: "sedang proses",
        label:
          "Sedang proses mencari tahu para petani anggota menyediakan tempat tinggal layak bagi pekerja mereka",
        score: 1,
      },
    ],
    roleSpecific: "manajer",
  },
  {
    id: "q300_26",
    text: "Apakah kelompok memantau ketersediaan kotak P3K di kebun anggota?",
    options: [
      {
        value: "ya",
        label: "Ya, kelompok memantau ketersediaan kotak P3K di kebun anggota",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, kelompok tidak memantau ketersediaan kotak P3K di kebun anggota",
        score: 0,
      },
      {
        value: "sedang proses",
        label: "Sedang proses memantau ketersediaan kotak P3K di kebun anggota",
        score: 1,
      },
    ],
    roleSpecific: "manajer",
  },
  {
    id: "q300_27",
    text: "Apakah kelompok memberikan pelatihan atau pendampingan terkait pemakaian APD oleh pekerja petani?",
    options: [
      {
        value: "ya",
        label:
          "Ya, kelompok memberikan pelatihan atau pendampingan terkait pemakaian APD oleh pekerja petani",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, kelompok tidak memberikan pelatihan atau pendampingan terkait pemakaian APD oleh pekerja petani",
        score: 0,
      },
      {
        value: "sedang proses",
        label:
          "Sedang proses memberikan pelatihan atau pendampingan terkait pemakaian APD oleh pekerja petani",
        score: 1,
      },
    ],
    roleSpecific: "manajer",
  },
  {
    id: "q300_28",
    text: "Apakah Anda memastikan adanya akses air minum dan toilet bagi pekerja di kebun anggota?",
    options: [
      {
        value: "ya",
        label:
          "Ya, saya memastikan adanya akses air minum dan toilet bagi pekerja di kebun anggota",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, saya tidak memastikan adanya akses air minum dan toilet bagi pekerja di kebun anggota",
        score: 0,
      },
      {
        value: "sedang proses",
        label:
          "Sedang proses memastikan adanya akses air minum dan toilet bagi pekerja di kebun anggota",
        score: 1,
      },
    ],
    roleSpecific: "manajer",
  },
  {
    id: "q300_29",
    text: "Apakah pekerja di kebun Anda merasa aman, tidak mengalami diskriminasi, pelecehan, atau kekerasan, dan bebas untuk menyampaikan keluhan jika ada masalah?",
    options: [
      {
        value: "ya",
        label: "Ya, pekerja dikebun saya merasa aman",
        score: 2,
      },
      {
        value: "tidak",
        label: "Tidak, pekerja dikebun saya tidak merasa aman",
        score: 0,
      },
      {
        value: "sedang proses",
        label:
          "Sedang proses membuat tempat kerja yang aman agar pekerja dikebun saya merasa aman",
        score: 1,
      },
    ],
    dependsOn: {
      questionId: "q19",
      requiredValue: "ya",
    },
  },
  {
    id: "q300_30",
    text: "Apakah kelompok secara berkala memeriksa atau mendapatkan umpan balik dari pekerja (melalui kunjungan atau laporan) bahwa mereka bekerja di lingkungan yang aman dan bebas dari diskriminasi, pelecehan, atau kekerasan?",
    options: [
      {
        value: "ya",
        label:
          "Ya, kelompok secara berkala memeriksa atau mendapatkan umpan balik dari pekerja (melalui kunjungan atau laporan) bahwa mereka bekerja di lingkungan yang aman dan bebas dari diskriminasi, pelecehan, atau kekerasan",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, kelompok tidak secara berkala memeriksa atau mendapatkan umpan balik dari pekerja (melalui kunjungan atau laporan) bahwa mereka bekerja di lingkungan yang aman dan bebas dari diskriminasi, pelecehan, atau kekerasan",
        score: 0,
      },
      {
        value: "sedang proses",
        label:
          "Sedang proses memastikan kelompok secara berkala memeriksa atau mendapatkan umpan balik dari pekerja (melalui kunjungan atau laporan) bahwa mereka bekerja di lingkungan yang aman dan bebas dari diskriminasi, pelecehan, atau kekerasan",
        score: 1,
      },
    ],
    roleSpecific: "manajer",
  },
  {
    id: "q300_31",
    text: "Apakah Bapak/Ibu sudah menerapkan praktik khusus untuk menjaga dan melindungi kawasan penting seperti hutan, satwa langka, atau kawasan yang rentan di kebun Bapak/Ibu?",
    options: [
      {
        value: "ya",
        label:
          "Ya, saya sudah menerapkan praktik khusus untuk menjaga dan melindungi kawasan penting",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, saya belum menerapkan praktik khusus untuk menjaga dan melindungi kawasan penting",
        score: 0,
      },
      {
        value: "sedang proses",
        label:
          "Sedang proses menerapkan praktik khusus untuk menjaga dan melindungi kawasan penting",
        score: 1,
      },
    ],
  },
  {
    id: "q300_32",
    text: "Apakah Bapak/Ibu mengetahui apakah ada kawasan penting (seperti hutan kecil, sumber air, atau tempat hidup satwa langka) di kebun Bapak/Ibu?",
    options: [
      {
        value: "ya",
        label:
          "Ya, saya sudah mengetahui ada kawasan penting di area sekitar kebun saya",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, saya belum mengetahui ada kawasan penting di area sekitar kebun saya",
        score: 0,
      },
      {
        value: "sedang proses",
        label:
          "Sedang proses mengetahui adanya kawasan penting di area sekitar kebun saya",
        score: 1,
      },
    ],
  },
  {
    id: "q300_33",
    text: "Apakah Bapak/Ibu melakukan tindakan untuk mencegah kerusakan atau gangguan terhadap kawasan atau satwa tersebut (misalnya tidak menebang, tidak membakar, atau membiarkan tumbuhan tertentu tumbuh)?",
    options: [
      {
        value: "ya",
        label:
          "Ya, saya melakukan tindakan untuk mencegah kerusakan atau gangguan terhadap kawasan atau satwa",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, saya tidak melakukan tindakan untuk mencegah kerusakan atau gangguan terhadap kawasan atau satwa",
        score: 0,
      },
      {
        value: "sedang proses",
        label:
          "Sedang proses melakukan tindakan untuk mencegah kerusakan atau gangguan terhadap kawasan atau satwa",
        score: 1,
      },
    ],
  },
  {
    id: "q300_34",
    text: "Apakah Bapak/Ibu secara rutin menjaga agar kawasan tersebut tetap terlindungi dan tidak diganggu oleh kegiatan kebun?",
    options: [
      {
        value: "ya",
        label:
          "Ya, saya secara rutin menjaga agar kawasan tersebut tetap terlindungi dan tidak diganggu oleh kegiatan kebun",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, saya secara rutin tidak menjaga agar kawasan tersebut tetap terlindungi dan tidak diganggu oleh kegiatan kebun",
        score: 0,
      },
      {
        value: "sedang proses",
        label:
          "Sedang proses secara rutin menjaga agar kawasan tersebut tetap terlindungi dan tidak diganggu oleh kegiatan kebun",
        score: 1,
      },
    ],
  },
  {
    id: "q300_35",
    text: "Apakah kelompok melakukan pemantauan terhadap kebun anggotanya untuk memastikan perlindungan terhadap area HCV, HCS, atau keberadaan spesies langka dan terancam punah?",
    options: [
      {
        value: "ya",
        label:
          "Ya, kelompok melakukan pemantauan terhadap kebun anggotanya untuk memastikan perlindungan terhadap area HCV, HCS, atau keberadaan spesies langka dan terancam punah",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, kelompok tidak melakukan pemantauan terhadap kebun anggotanya untuk memastikan perlindungan terhadap area HCV, HCS, atau keberadaan spesies langka dan terancam punah",
        score: 0,
      },
      {
        value: "sedang proses",
        label:
          "Sedang proses melakukan pemantauan terhadap kebun anggotanya untuk memastikan perlindungan terhadap area HCV, HCS, atau keberadaan spesies langka dan terancam punah",
        score: 1,
      },
    ],
    roleSpecific: "manajer",
  },
  {
    id: "q300_36",
    text: "Apakah kelompok telah memetakan atau mengidentifikasi area HCV, HCS, atau habitat satwa langka di dalam wilayah sertifikasi kelompok?",
    options: [
      {
        value: "ya",
        label:
          "Ya, kelompok telah memetakan atau mengidentifikasi area HCV, HCS, atau habitat satwa langka di dalam wilayah sertifikasi kelompok",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, kelompok belum memetakan atau mengidentifikasi area HCV, HCS, atau habitat satwa langka di dalam wilayah sertifikasi kelompok",
        score: 0,
      },
      {
        value: "sedang proses",
        label:
          "Sedang proses melakukan memetakan atau mengidentifikasi area HCV, HCS, atau habitat satwa langka di dalam wilayah sertifikasi kelompok",
        score: 1,
      },
    ],
    roleSpecific: "manajer",
  },
  {
    id: "q300_37",
    text: "Apakah kelompok memantau dan memberi pendampingan kepada anggota untuk melindungi kawasan atau spesies yang penting tersebut?",
    options: [
      {
        value: "ya",
        label:
          "Ya, kelompok memantau dan memberi pendampingan kepada anggota untuk melindungi kawasan atau spesies yang penting",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, kelompok tidak memantau dan memberi pendampingan kepada anggota untuk melindungi kawasan atau spesies yang penting",
        score: 0,
      },
      {
        value: "sedang proses",
        label:
          "Sedang proses melakukan pemantauan dan memberi pendampingan kepada anggota untuk melindungi kawasan atau spesies yang penting",
        score: 1,
      },
    ],
    roleSpecific: "manajer",
  },
  {
    id: "q300_38",
    text: "Apakah kelompok memiliki rencana remediasi yang sudah disetujui RSPO untuk memperbaiki kehilangan area HCV (sejak 2005) dan hutan HCS (sejak 2019)?",
    options: [
      {
        value: "ya",
        label:
          "Ya, kelompok memiliki rencana remediasi yang sudah disetujui RSPO",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, kelompok tidak memiliki rencana remediasi yang sudah disetujui RSPO",
        score: 0,
      },
      {
        value: "sedang proses",
        label:
          "Sedang proses membuat rencana remediasi yang akan disetujui RSPO",
        score: 1,
      },
    ],
    roleSpecific: "manajer",
  },
  {
    id: "q300_39",
    text: "Apakah rencana remediasi tersebut sedang dijalankan oleh kelompok saat ini?",
    options: [
      {
        value: "ya",
        label: "Ya, rencana remediasi tersebut sedang dijalankan oleh kelompok",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, rencana remediasi tersebut belum dijalankan oleh kelompok",
        score: 0,
      },
      {
        value: "sedang proses",
        label:
          "Rencana remediasi tersebut sedang proses akan dijalankan oleh kelompok",
        score: 1,
      },
    ],
    roleSpecific: "manajer",
  },
  {
    id: "q300_40",
    text: "Apakah Bapak/Ibu dan kelompok petani sudah menyusun rencana bersama untuk membuka kebun sawit baru?",
    options: [
      {
        value: "ya",
        label:
          "Ya, sudah menyusun rencana bersama untuk membuka kebun sawit baru",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, belum menyusun rencana bersama untuk membuka kebun sawit baru",
        score: 0,
      },
      {
        value: "sedang proses",
        label:
          "Sedang proses menyusun rencana bersama untuk membuka kebun sawit baru",
        score: 1,
      },
    ],
  },
  {
    id: "q300_41",
    text: "Apakah Bapak/Ibu tahu bahwa rencana tersebut sudah dibagikan kepada pihak-pihak yang ikut dalam pemetaan bersama (seperti tetangga, tokoh adat, atau perangkat desa)?",
    options: [
      {
        value: "ya",
        label:
          "Ya, saya mengetahui bahwa rencana tersebut sudah dibagikan kepada pihak-pihak yang ikut dalam pemetaan bersama",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, saya tidak mengetahui bahwa rencana tersebut sudah dibagikan kepada pihak-pihak yang ikut dalam pemetaan bersama",
        score: 0,
      },
      {
        value: "sedang proses",
        label:
          "Sedang proses mencari tahu bahwa rencana tersebut sudah dibagikan kepada pihak-pihak yang ikut dalam pemetaan bersama",
        score: 1,
      },
    ],
  },
  {
    id: "q300_42",
    text: "Apakah Bapak/Ibu tahu bahwa rencana tersebut sudah disetujui oleh RSPO?",
    options: [
      {
        value: "ya",
        label:
          "Ya, sudah mengetahui bahwa rencana tersebut sudah disetuji oleh RSPO",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, belum mengetahui bahwa rencana tersebut sudah disetuji oleh RSPO",
        score: 0,
      },
      {
        value: "sedang proses",
        label:
          "Sedang proses mencari tahu bahwa rencana tersebut sudah disetuji oleh RSPO",
        score: 1,
      },
    ],
  },
  {
    id: "q300_43",
    text: "Apakah kelompok telah memiliki dokumen rencana pengelolaan penanaman baru yang sudah disetujui oleh RSPO?",
    options: [
      {
        value: "ya",
        label:
          "Ya, kelompok telah memiliki dokumen rencana pengelolaan penanaman baru yang sudah disetujui oleh RSPO",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, kelompok belum memiliki dokumen rencana pengelolaan penanaman baru yang sudah disetujui oleh RSPO",
        score: 0,
      },
      {
        value: "sedang proses",
        label:
          "Sedang proses membuat dokumen rencana pengelolaan penanaman baru yang akan disetujui oleh RSPO",
        score: 1,
      },
    ],
    roleSpecific: "manajer",
  },
  {
    id: "q300_44",
    text: "Apakah kelompok sudah menyampaikan rencana ini kepada semua pihak yang terlibat dalam proses pemetaan partisipatif sebelum lahan dibuka?",
    options: [
      {
        value: "ya",
        label:
          "Ya, kelompok sudah menyampaikan rencana ini kepada semua pihak yang terlibat dalam proses pemetaan partisipatif sebelum lahan dibuka",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, kelompok belum menyampaikan rencana ini kepada semua pihak yang terlibat dalam proses pemetaan partisipatif sebelum lahan dibuka",
        score: 0,
      },
      {
        value: "sedang proses",
        label:
          "Sedang proses menyampaikan rencana ini kepada semua pihak yang terlibat dalam proses pemetaan partisipatif sebelum lahan dibuka",
        score: 1,
      },
    ],
    roleSpecific: "manajer",
  },
  {
    id: "q300_45",
    text: "Apakah Bapak/Ibu menjalankan panduan kelompok terkait cara mencegah kebakaran dan mengelola air di kebun sawit?",
    options: [
      {
        value: "ya",
        label:
          "Ya, saya menjalankan panduan kelompok terkait cara mencegah kebakaran dan mengelola air di kebun sawit",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, saya belum menjalankan panduan kelompok terkait cara mencegah kebakaran dan mengelola air di kebun sawit",
        score: 0,
      },
      {
        value: "sedang proses",
        label:
          "Sedang proses menjalankan panduan kelompok terkait cara mencegah kebakaran dan mengelola air di kebun sawit",
        score: 1,
      },
    ],
  },
  {
    id: "q300_46",
    text: "Jika kebun Bapak/Ibu berada di lahan gambut, apakah Bapak/Ibu mengetahui atau melakukan pemantauan terhadap penurunan permukaan tanah (tenggelamnya lahan)?",
    options: [
      {
        value: "ya",
        label:
          "Ya, saya mengetahui dan melakukan pemantauan terhadap penurunan permukaan tanah",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, saya tidak mengetahui dan tidak melakukan pemantauan terhadap penurunan permukaan tanah",
        score: 0,
      },
      {
        value: "sedang proses",
        label:
          "Sedang proses memahami dan mencoba melakukan pemantauan terhadap penurunan permukaan tanah",
        score: 1,
      },
    ],
  },
  {
    id: "q300_47",
    text: "Apakah kelompok memiliki rencana aksi tertulis untuk mengelola api, air, dan lahan gambut yang telah ditanami?",
    options: [
      {
        value: "ya",
        label:
          "Ya, kelompok memiliki rencana aksi tertulis untuk mengelola api, air, dan lahan gambut yang telah ditanami",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, kelompok tidak memiliki rencana aksi tertulis untuk mengelola api, air, dan lahan gambut yang telah ditanami",
        score: 0,
      },
      {
        value: "sedang proses",
        label:
          "Sedang proses memahami untuk membuat rencana aksi tertulis untuk mengelola api, air, dan lahan gambut yang telah ditanami",
        score: 1,
      },
    ],
    roleSpecific: "manajer",
  },
  {
    id: "q300_48",
    text: "Apakah kelompok memantau dan mencatat penurunan permukaan tanah di lahan gambut?",
    options: [
      {
        value: "ya",
        label:
          "Ya, kelompok memantau dan mencatat penurunan permukaan tanah di lahan gambut",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, kelompok tidak memantau dan mencatat penurunan permukaan tanah di lahan gambut",
        score: 0,
      },
      {
        value: "sedang proses",
        label:
          "Sedang proses memantau dan mencatat penurunan permukaan tanah di lahan gambut",
        score: 1,
      },
    ],
    roleSpecific: "manajer",
  },
  {
    id: "q300_49",
    text: "Apakah Bapak/Ibu mengetahui apakah lahan yang akan ditanam ulang termasuk lahan gambut?",
    options: [
      {
        value: "ya",
        label:
          "Ya, mengetahui lahan yang akan ditanam ulang termasuk lahan gambut",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak mengetahui apakah lahan yang akan ditanam ulang termasuk lahan gambut",
        score: 0,
      },
      {
        value: "sedang proses",
        label:
          "Sedang proses mengetahui apakah lahan yang akan ditanam ulang termasuk lahan gambut",
        score: 1,
      },
    ],
  },
  {
    id: "q300_50",
    text: "Apakah Bapak/Ibu pernah mengalami banjir atau masuknya air asin di kebun tersebut?",
    options: [
      {
        value: "ya",
        label:
          "Ya, saya pernah mengalami banjir atau masuknya air asin di kebun",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, saya tidak pernah mengalami banjir atau masuknya air asin di kebun ",
        score: 0,
      },
      {
        value: "sedang proses",
        label:
          "Tidak pernah mengetahui mengalami banjir atau masuknya air asin di kebun ",
        score: 1,
      },
    ],
    triggerSubQuestions: "ya",
    subQuestions: [
      {
        id: "q300_50_sub1",
        text: "Jika lahan Bapak/Ibu rawan banjir atau air asin, apakah sudah ada rencana lain untuk mengelola lahan itu?",
        options: [
          {
            value: "ya",
            label: "Ya, sudah ada rencana lain untuk mengelola lahan",
            score: 2,
          },
          {
            value: "tidak",
            label: "Tidak ada rencana lain untuk mengelola lahan",
            score: 0,
          },
          {
            value: "sedang proses",
            label: "Sedang proses membuat rencana lain untuk mengelola lahan",
            score: 1,
          },
        ],
      },
    ],
  },
  {
    id: "q300_51",
    text: "Apakah kelompok membantu petani menilai risiko banjir atau air asin sebelum menanam ulang di lahan gambut?",
    options: [
      {
        value: "ya",
        label:
          "Ya, kelompok membantu petani menilai risiko banjir atau air asin sebelum menanam ulang di lahan gambut",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, kelompok tidak membantu petani menilai risiko banjir atau air asin sebelum menanam ulang di lahan gambut",
        score: 0,
      },
      {
        value: "sedang proses",
        label:
          "Sedang proses merencanakan untuk membantu petani menilai risiko banjir atau air asin sebelum menanam ulang di lahan gambut",
        score: 1,
      },
    ],
    roleSpecific: "manajer",
  },
  {
    id: "q300_52",
    text: "Apakah kelompok pernah menyusun rencana bersama petani untuk mencari cara lain mengelola lahan gambut yang berisiko tinggi?",
    options: [
      {
        value: "ya",
        label:
          "Ya, kelompok pernah menyusun rencana bersama petani untuk mencari cara lain mengelola lahan gambut yang berisiko tinggi",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, kelompok tidak pernah menyusun rencana bersama petani untuk mencari cara lain mengelola lahan gambut yang berisiko tinggi",
        score: 0,
      },
      {
        value: "sedang proses",
        label:
          "Sedang proses menyusun rencana bersama petani untuk mencari cara lain mengelola lahan gambut yang berisiko tinggi",
        score: 1,
      },
    ],
    roleSpecific: "manajer",
  },
  {
    id: "q300_53",
    text: "Apakah Bapak/Ibu pernah menggunakan api untuk membersihkan lahan, membakar limbah, atau mengendalikan hama?",
    options: [
      {
        value: "ya",
        label:
          "Ya, saya pernah menggunakan api untuk membersihkan lahan, membakar limbah, atau mengendalikan hama",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, saya tidak pernah menggunakan api untuk membersihkan lahan, membakar limbah, atau mengendalikan hama ",
        score: 0,
      },
      {
        value: "sedang proses",
        label:
          "Sedang proses mengetahui cara menggunakan api untuk membersihkan lahan, membakar limbah, atau mengendalikan hama ",
        score: 1,
      },
    ],
    triggerSubQuestions: "ya",
    subQuestions: [
      {
        id: "q300_53_sub1",
        text: "Jika pernah, apakah itu dilakukan karena tidak ada cara lain dan sudah mendapatkan izin dari pihak berwenang?",
        options: [
          {
            value: "ya",
            label:
              "Ya, dilakukan karena tidak ada cara lain dan sudah mendapatkan izin dari pihak berwenang",
            score: 2,
          },
          {
            value: "tidak",
            label:
              "Tidak, dilakukan karena ada cara lain dan belum mendapatkan izin dari pihak berwenang",
            score: 0,
          },
          {
            value: "sedang proses",
            label: "Sedang proses",
            score: 1,
          },
        ],
      },
    ],
  },
  {
    id: "q300_54",
    text: "Apakah kelompok memiliki aturan atau panduan untuk memastikan anggota tidak membakar lahan atau limbah?",
    options: [
      {
        value: "ya",
        label:
          "Ya, kelompok memiliki aturan atau panduan untuk memastikan anggota tidak membakar lahan atau limbah",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, kelompok tidak memiliki aturan atau panduan untuk memastikan anggota tidak membakar lahan atau limbah",
        score: 0,
      },
      {
        value: "sedang proses",
        label:
          "Sedang proses menyusun rencana memiliki aturan atau panduan untuk memastikan anggota tidak membakar lahan atau limbah",
        score: 1,
      },
    ],
    roleSpecific: "manajer",
  },
  {
    id: "q300_55",
    text: "Apakah kelompok memantau dan mencatat jika ada anggota yang menggunakan api dalam situasi tertentu?",
    options: [
      {
        value: "ya",
        label:
          "Ya, kelompok memantau dan mencatat jika ada anggota yang menggunakan api dalam situasi tertentu",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, kelompok tidak memantau dan mencatat jika ada anggota yang menggunakan api dalam situasi tertentu",
        score: 0,
      },
      {
        value: "sedang proses",
        label:
          "Sedang proses memantau dan mencatat jika ada anggota yang menggunakan api dalam situasi tertentu",
        score: 1,
      },
    ],
    roleSpecific: "manajer",
  },
  {
    id: "q300_56",
    text: "Apakah Bapak/Ibu menyimpan pestisida atau bahan kimia lain di tempat khusus yang aman dan jauh dari anak-anak?",
    options: [
      {
        value: "ya",
        label:
          "Ya, saya menyimpan pestisida atau bahan kimia lain di tempat khusus yang aman dan jauh dari anak-anak",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, saya tidak menyimpan pestisida atau bahan kimia lain di tempat khusus yang aman dan jauh dari anak-anak",
        score: 0,
      },
      {
        value: "sedang proses",
        label:
          "Sedang proses menyimpan pestisida atau bahan kimia lain di tempat khusus yang aman dan jauh dari anak-anak",
        score: 1,
      },
    ],
  },
  {
    id: "q300_57",
    text: "Apakah Bapak/Ibu mencampur dan menggunakan pestisida sesuai aturan (misalnya menggunakan alat pelindung diri dan tidak sembarangan menyemprot)?",
    options: [
      {
        value: "ya",
        label: "Ya, saya mencampur dan menggunakan pestisida sesuai aturan",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, saya tidak mencampur dan menggunakan pestisida sesuai aturan",
        score: 0,
      },
      {
        value: "sedang proses",
        label:
          "Sedang proses cara mencampur dan menggunakan pestisida sesuai aturan",
        score: 1,
      },
    ],
  },
  {
    id: "q300_58",
    text: "Apakah Bapak/Ibu membuang botol atau wadah bekas pestisida di tempat yang aman dan tidak dibakar atau dibuang sembarangan?",
    options: [
      {
        value: "ya",
        label:
          "Ya, saya membuang botol atau wadah bekas pestisida di tempat yang aman dan tidak dibakar atau dibuang sembarangan",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, saya tidak membuang botol atau wadah bekas pestisida di tempat yang aman dan tidak dibakar atau dibuang sembarangan",
        score: 0,
      },
      {
        value: "sedang proses",
        label:
          "Sedang proses cara membuang botol atau wadah bekas pestisida di tempat yang aman dan tidak dibakar atau dibuang sembarangan",
        score: 1,
      },
    ],
  },
  {
    id: "q300_59",
    text: "Apakah kelompok memberikan pelatihan atau panduan kepada petani tentang cara menyimpan, menggunakan, dan membuang bahan kimia pertanian dengan aman?",
    options: [
      {
        value: "ya",
        label:
          "Ya, kelompok memberikan pelatihan atau panduan kepada petani tentang cara menyimpan, menggunakan, dan membuang bahan kimia pertanian dengan aman",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, kelompok tidak memberikan pelatihan atau panduan kepada petani tentang cara menyimpan, menggunakan, dan membuang bahan kimia pertanian dengan aman",
        score: 0,
      },
      {
        value: "sedang proses",
        label:
          "Sedang proses memberikan pelatihan atau panduan kepada petani tentang cara menyimpan, menggunakan, dan membuang bahan kimia pertanian dengan aman",
        score: 1,
      },
    ],
    roleSpecific: "manajer",
  },
  {
    id: "q300_60",
    text: "Apakah kelompok secara berkala memantau bagaimana petani menangani dan menyimpan bahan kimia tersebut di kebunnya?",
    options: [
      {
        value: "ya",
        label:
          "Ya, kelompok secara berkala memantau bagaimana petani menangani dan menyimpan bahan kimia tersebut di kebunnya",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, kelompok tidak secara berkala memantau bagaimana petani menangani dan menyimpan bahan kimia tersebut di kebunnya",
        score: 0,
      },
      {
        value: "sedang proses",
        label:
          "Sedang proses merencanakan agar kelompok secara berkala memantau bagaimana petani menangani dan menyimpan bahan kimia tersebut di kebunnya",
        score: 1,
      },
    ],
    roleSpecific: "manajer",
  },
  {
    id: "q300_61",
    text: "Apakah Bapak/Ibu mengetahui siapa saja yang diperbolehkan menggunakan pestisida di kebun (misalnya bukan anak-anak atau ibu hamil/menyusui)?",
    options: [
      {
        value: "ya",
        label:
          "Ya, saya mengetahui siapa saja yang diperbolehkan menggunakan pestisida di kebun",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, saya tidak mengetahui siapa saja yang diperbolehkan menggunakan pestisida di kebun",
        score: 0,
      },
      {
        value: "sedang proses",
        label:
          "Sedang proses mengetahui siapa saja yang diperbolehkan menggunakan pestisida di kebun",
        score: 1,
      },
    ],
  },
  {
    id: "q300_62",
    text: "Apakah Bapak/Ibu menggunakan pestisida dengan mengikuti aturan yang aman, seperti tidak memakai jenis pestisida yang sangat berbahaya atau yang dilarang?",
    options: [
      {
        value: "ya",
        label:
          "Ya, saya menggunakan pestisida dengan mengikuti aturan yang aman",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, saya tidak menggunakan pestisida dengan mengikuti aturan yang aman",
        score: 0,
      },
      {
        value: "sedang proses",
        label:
          "Sedang proses cara menggunakan pestisida dengan mengikuti aturan yang aman",
        score: 1,
      },
    ],
  },
  {
    id: "q300_63",
    text: "Apakah kelompok memberikan panduan atau daftar pestisida yang dilarang digunakan, seperti paraquat atau pestisida kategori WHO 1A dan 1B?",
    options: [
      {
        value: "ya",
        label:
          "Ya, kelompok memberikan panduan atau daftar pestisida yang dilarang digunakan",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, kelompok tidak memberikan panduan atau daftar pestisida yang dilarang digunakan",
        score: 0,
      },
      {
        value: "sedang proses",
        label:
          "Sedang proses memberikan panduan atau daftar pestisida yang dilarang digunakan",
        score: 1,
      },
    ],
    roleSpecific: "manajer",
  },
  {
    id: "q300_64",
    text: "Apakah kelompok memastikan bahwa tidak ada ibu hamil, menyusui, atau pekerja anak yang terlibat dalam penyemprotan pestisida?",
    options: [
      {
        value: "ya",
        label:
          "Ya, kelompok memastikan bahwa tidak ada ibu hamil, menyusui, atau pekerja anak yang terlibat dalam penyemprotan pestisida",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, kelompok tidak memastikan bahwa tidak ada ibu hamil, menyusui, atau pekerja anak yang terlibat dalam penyemprotan pestisida",
        score: 0,
      },
      {
        value: "sedang proses",
        label:
          "Sedang proses memastikan bahwa tidak ada ibu hamil, menyusui, atau pekerja anak yang terlibat dalam penyemprotan pestisida",
        score: 1,
      },
    ],
    roleSpecific: "manajer",
  },
  {
    id: "q300_65",
    text: "Apakah Bapak/Ibu pernah mencoba cara lain selain menggunakan pestisida atau herbisida untuk mengendalikan hama dan gulma di kebun?",
    options: [
      {
        value: "ya",
        label:
          "Ya, saya pernah mencoba cara lain selain menggunakan pestisida atau herbisida untuk mengendalikan hama dan gulma di kebun",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, saya tidak pernah mencoba cara lain selain menggunakan pestisida atau herbisida untuk mengendalikan hama dan gulma di kebun",
        score: 0,
      },
      {
        value: "sedang proses",
        label:
          "Sedang proses mencoba cara lain selain menggunakan pestisida atau herbisida untuk mengendalikan hama dan gulma di kebun",
        score: 1,
      },
    ],
  },
  {
    id: "q300_66",
    text: "Apakah Bapak/Ibu rutin melakukan pengendalian hama dengan cara yang ramah lingkungan, seperti menggunakan musuh alami, menanam tanaman perangkap, atau membersihkan gulma secara manual?",
    options: [
      {
        value: "ya",
        label:
          "Ya, saya melakukan pengendalian hama dengan cara yang ramah lingkungan",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, saya tidak melakukan pengendalian hama dengan cara yang ramah lingkungan",
        score: 0,
      },
      {
        value: "sedang proses",
        label:
          "Sedang proses melakukan pengendalian hama dengan cara yang ramah lingkungan",
        score: 1,
      },
    ],
  },
  {
    id: "q300_67",
    text: "Apakah kelompok mendorong dan memberikan pelatihan kepada petani untuk mengurangi penggunaan pestisida dan herbisida di kebun?",
    options: [
      {
        value: "ya",
        label:
          "Ya, kelompok mendorong dan memberikan pelatihan kepada petani untuk mengurangi penggunaan pestisida dan herbisida di kebun",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, kelompok tidak mendorong dan tidak memberikan pelatihan kepada petani untuk mengurangi penggunaan pestisida dan herbisida di kebun",
        score: 0,
      },
      {
        value: "sedang proses",
        label:
          "Sedang proses mendorong dan memberikan pelatihan kepada petani untuk mengurangi penggunaan pestisida dan herbisida di kebun",
        score: 1,
      },
    ],
    roleSpecific: "manajer",
  },
  {
    id: "q300_68",
    text: "Apakah kelompok mencatat atau memantau penerapan cara-cara Pengendalian Hama Terpadu (PHT) oleh petani di kebun mereka?",
    options: [
      {
        value: "ya",
        label:
          "Ya, kelompok mencatat atau memantau penerapan cara-cara Pengendalian Hama Terpadu (PHT) oleh petani di kebun",
        score: 2,
      },
      {
        value: "tidak",
        label:
          "Tidak, kelompok tidak mencatat atau memantau penerapan cara-cara Pengendalian Hama Terpadu (PHT) oleh petani di kebun",
        score: 0,
      },
      {
        value: "sedang proses",
        label:
          "Sedang proses mencatat atau memantau penerapan cara-cara Pengendalian Hama Terpadu (PHT) oleh petani di kebun",
        score: 1,
      },
    ],
    roleSpecific: "manajer",
  },
];
