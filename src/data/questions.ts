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
      { value: "ya", label: "Ya, Memiliki Dokumen Tambahan", score: 2 },
      { value: "proses", label: "Sedang Proses Memperoleh Dokumen", score: 1 },
      { value: "tidak", label: "Tidak Memiliki Dokumen Tambahan", score: 0 },
    ],
  },
  {
    id: "q4",
    text: "4. Apakah Bapak/Ibu sudah menandatangani pernyataan komitmen sebagai petani sawit berkelanjutan (Smallholder Declaration)?",
    options: [
      { value: "ya", label: "Ya, Sudah Menandatangani", score: 2 },
      { value: "proses", label: "Sedang Proses Menandatangani", score: 1 },
      { value: "tidak", label: "Tidak Menandatangani", score: 0 },
    ],
  },
  {
    id: "q5",
    text: "5. Apakah Bapak/Ibu bersedia menerapkan praktik pertanian yang baik di kebun sendiri sesuai prinsip RSPO?",
    options: [
      { value: "ya", label: "Ya, Bersedia Menerapkan Praktik Baik", score: 2 },
      {
        value: "proses",
        label: "Sedang Proses Menerapkan Praktik Baik",
        score: 1,
      },
      {
        value: "tidak",
        label: "Tidak Bersedia Menerapkan Praktik Baik",
        score: 0,
      },
    ],
  },
  {
    id: "q6",
    text: "6. Apakah Bapak/Ibu berkomitmen menerapkan praktik pertanian yang baik (GAP) di kebun?",
    options: [
      { value: "ya", label: "Ya, Berkomitmen Menerapkan GAP", score: 2 },
      { value: "proses", label: "Sedang Proses Menerapkan GAP", score: 1 },
      { value: "tidak", label: "Tidak Berkomitmen Menerapkan GAP", score: 0 },
    ],
  },
  {
    id: "q7",
    text: "7. Apakah Bapak/Ibu memiliki peta atau titik koordinat kebun, dan dapat menunjukkan bukti hak atas lahan tersebut (misalnya surat, warisan, hak adat)?",
    options: [
      { value: "ya", label: "Ya, Memiliki Peta dan Bukti Hak Lahan", score: 2 },
      {
        value: "proses",
        label: "Sedang Proses Memperoleh Peta dan Bukti Hak Lahan",
        score: 1,
      },
      {
        value: "tidak",
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
          { value: "ya", label: "Ya, Sedang Proses Legalisasi", score: 2 },
          { value: "proses", label: "Sedang Proses Legalisasi", score: 1 },
          { value: "tidak", label: "Tidak Sedang Proses Legalisasi", score: 0 },
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
  {
    id: "q100_land_ownership",
    text: "Apakah Anda memiliki lahan untuk budidaya kelapa sawit?",
    options: [
      { value: "ya", label: "Ya", score: 2 },
      { value: "proses", label: "Sedang Proses", score: 1 },
      { value: "tidak", label: "Tidak", score: 0 },
    ],
    subQuestions: [
      {
        id: "q100_sub1_land_size",
        text: "Berapa luas lahan yang Anda miliki?",
        triggerValue: "ya",
        options: [
          { value: "kurang_2ha", label: "< 2 Ha", score: 1 },
          { value: "2_5ha", label: "2-5 Ha", score: 2 },
          { value: "lebih_5ha", label: "> 5 Ha", score: 2 },
        ],
      },
      {
        id: "q100_sub2_land_certificate",
        text: "Apakah lahan tersebut memiliki sertifikat?",
        triggerValue: "ya",
        options: [
          { value: "ya", label: "Ya", score: 2 },
          { value: "proses", label: "Sedang Proses", score: 1 },
          { value: "tidak", label: "Tidak", score: 0 },
        ],
      },
      {
        id: "q100_sub3_future_plan",
        text: "Apakah Anda berencana memiliki lahan dalam waktu dekat?",
        triggerValue: "tidak",
        options: [
          { value: "ya_1tahun", label: "Ya, dalam 1 tahun ke depan", score: 1 },
          {
            value: "ya_2tahun",
            label: "Ya, dalam 2-3 tahun ke depan",
            score: 1,
          },
          { value: "belum_tahu", label: "Belum tahu pasti", score: 0 },
          { value: "tidak_berencana", label: "Tidak ada rencana", score: 0 },
        ],
      },
    ],
  },
  {
    id: "q200_experience",
    text: "Berapa lama pengalaman Anda dalam budidaya kelapa sawit?",
    options: [
      { value: "baru", label: "Baru memulai (0-1 tahun)", score: 0 },
      { value: "pemula", label: "Pemula (1-3 tahun)", score: 1 },
      { value: "berpengalaman", label: "Berpengalaman (>3 tahun)", score: 2 },
    ],
  },
  {
    id: "q300_training",
    text: "Apakah Anda pernah mengikuti pelatihan tentang praktik budidaya kelapa sawit berkelanjutan?",
    options: [
      { value: "ya", label: "Ya", score: 2 },
      { value: "sebagian", label: "Sebagian", score: 1 },
      { value: "tidak", label: "Tidak", score: 0 },
    ],
    subQuestions: [
      {
        id: "q300_sub1_training_source",
        text: "Dari mana Anda mendapatkan pelatihan tersebut?",
        triggerValue: "ya",
        options: [
          { value: "pemerintah", label: "Instansi pemerintah", score: 2 },
          { value: "swasta", label: "Perusahaan swasta", score: 2 },
          { value: "ngo", label: "LSM/NGO", score: 1 },
          { value: "mandiri", label: "Belajar mandiri", score: 1 },
        ],
      },
      {
        id: "q300_sub2_training_interest",
        text: "Apakah Anda tertarik mengikuti pelatihan SAT RSPO di masa depan?",
        triggerValue: "tidak",
        options: [
          { value: "sangat_tertarik", label: "Sangat tertarik", score: 2 },
          { value: "tertarik", label: "Tertarik", score: 1 },
          { value: "mungkin", label: "Mungkin", score: 1 },
          { value: "tidak_tertarik", label: "Tidak tertarik", score: 0 },
        ],
      },
    ],
  },
  {
    id: "q400_group_membership",
    text: "Apakah Anda tergabung dalam kelompok tani atau koperasi?",
    options: [
      { value: "ya", label: "Ya, aktif", score: 2 },
      { value: "pasif", label: "Ya, tapi tidak aktif", score: 1 },
      { value: "tidak", label: "Tidak", score: 0 },
    ],
    triggerSubQuestions: "ya",
    subQuestions: [
      {
        id: "q400_sub1_group_training",
        text: "Apakah kelompok tersebut memberikan pelatihan berkelanjutan?",
        options: [
          { value: "ya", label: "Ya, rutin", score: 2 },
          { value: "kadang", label: "Kadang-kadang", score: 1 },
          { value: "tidak", label: "Tidak", score: 0 },
        ],
      },
    ],
  },
  {
    id: "q500_sat_familiarity",
    text: "Apakah Anda sudah familiar dengan SAT untuk sertifikasi RSPO melalui platform PADI?",
    options: [
      { value: "ya", label: "Ya, sudah familiar", score: 2 },
      { value: "sedikit", label: "Sedikit familiar", score: 1 },
      { value: "tidak", label: "Tidak familiar", score: 0 },
    ],
    subQuestions: [
      {
        id: "q500_sub1_sat_experience",
        text: "Berapa lama Anda sudah menggunakan SAT?",
        triggerValue: "ya",
        options: [
          { value: "kurang_1_tahun", label: "Kurang dari 1 tahun", score: 1 },
          { value: "1_3_tahun", label: "1-3 tahun", score: 2 },
          { value: "lebih_3_tahun", label: "Lebih dari 3 tahun", score: 3 },
        ],
      },
      {
        id: "q500_sub2_sat_interest",
        text: "Apakah Anda tertarik mempelajari lebih lanjut tentang SAT RSPO?",
        triggerValue: "tidak",
        options: [
          { value: "sangat_tertarik", label: "Sangat tertarik", score: 2 },
          { value: "tertarik", label: "Tertarik", score: 1 },
          { value: "mungkin", label: "Mungkin", score: 1 },
          { value: "tidak_tertarik", label: "Tidak tertarik", score: 0 },
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
    id: "q200_1_plantation_management",
    text: "Bagaimana Anda mengelola kebun kelapa sawit?",
    options: [
      {
        value: "sistematis",
        label: "Dengan sistem yang terorganisir",
        score: 2,
      },
      { value: "sebagian", label: "Sebagian sistematis", score: 1 },
      { value: "tradisional", label: "Cara tradisional", score: 0 },
    ],
    dependsOn: {
      questionId: "q100_land_ownership",
      requiredValue: "ya",
    },
  },
  {
    id: "q200_2_fertilizer_use",
    text: "Bagaimana penggunaan pupuk di kebun Anda?",
    options: [
      {
        value: "organik_anorganik",
        label: "Kombinasi organik dan anorganik",
        score: 2,
      },
      { value: "anorganik", label: "Hanya anorganik", score: 1 },
      { value: "tidak_teratur", label: "Tidak teratur", score: 0 },
    ],
    dependsOn: {
      questionId: "q1_land_ownership",
      requiredValue: "ya",
    },
  },
  {
    id: "q200_3_worker_management",
    text: "Bagaimana Anda mengelola pekerja di kebun?",
    options: [
      {
        value: "kontrak_jelas",
        label: "Dengan kontrak kerja yang jelas",
        score: 2,
      },
      { value: "informal", label: "Secara informal", score: 1 },
      { value: "tidak_ada", label: "Bekerja sendiri", score: 1 },
    ],
    roleSpecific: "manajer",
  },
  {
    id: "q200_4_record_keeping",
    text: "Apakah Anda mencatat aktivitas kebun secara rutin?",
    options: [
      { value: "lengkap", label: "Ya, sangat lengkap", score: 2 },
      { value: "sebagian", label: "Sebagian saja", score: 1 },
      { value: "tidak", label: "Tidak mencatat", score: 0 },
    ],
  },
];

export const stage3Questions: Question[] = [
  {
    id: "q300_1_sustainability_practice",
    text: "Apakah Anda menerapkan praktik ramah lingkungan di kebun?",
    options: [
      { value: "konsisten", label: "Ya, secara konsisten", score: 2 },
      { value: "kadang", label: "Kadang-kadang", score: 1 },
      { value: "tidak", label: "Belum menerapkan", score: 0 },
    ],
  },
  {
    id: "q300_2_waste_management",
    text: "Bagaimana pengelolaan limbah di kebun Anda?",
    options: [
      { value: "daur_ulang", label: "Didaur ulang untuk kompos", score: 2 },
      {
        value: "dibuang_baik",
        label: "Dibuang dengan cara yang baik",
        score: 1,
      },
      { value: "dibuang_sembarangan", label: "Dibuang sembarangan", score: 0 },
    ],
  },
  {
    id: "q300_3_community_involvement",
    text: "Apakah Anda terlibat dalam program kemasyarakatan?",
    options: [
      { value: "aktif", label: "Sangat aktif", score: 2 },
      { value: "kadang", label: "Kadang-kadang", score: 1 },
      { value: "tidak", label: "Tidak terlibat", score: 0 },
    ],
  },
  {
    id: "q300_4_continuous_improvement",
    text: "Apakah Anda berkomitmen untuk terus meningkatkan praktik budidaya?",
    options: [
      { value: "ya", label: "Ya, sangat berkomitmen", score: 2 },
      { value: "mungkin", label: "Mungkin akan meningkatkan", score: 1 },
      { value: "tidak", label: "Belum ada rencana", score: 0 },
    ],
  },
];
