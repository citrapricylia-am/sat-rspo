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
      { value: "sudah_terdaftar", label: "Ya, Sudah Terdaftar", score: 2 },
      { value: "sedang_proses_bergabung", label: "Sedang Proses Bergabung", score: 1 },
      { value: "tidak_terdaftar", label: "Tidak Terdaftar", score: 0 },
    ],
  },
  {
    id: "q2",
    text: "2. Jika Bapak/Ibu tergabung dalam kelompok, apakah pengambilan keputusan di kelompok dilakukan secara adil dan terbuka? Jika belum tergabung, apakah Bapak/Ibu memahami pentingnya sistem seperti itu?",
    options: [
      { value: "pengambilan_keputusan_adil", label: "Ya, Pengambilan Keputusan Adil", score: 2 },
      { value: "sedang_proses_membangun_sistem", label: "Sedang Proses Membangun Sistem", score: 1 },
      {
        value: "tidak_memahami_pentingnya_sistem",
        label: "Tidak Memahami Pentingnya Sistem",
        score: 0,
      },
    ],
  },
  {
    id: "q3",
    text: "3. Apakah kelompok (jika sudah ada) memiliki dokumen tambahan sesuai aturan negara? Jika belum tergabung, apakah Bapak/Ibu mengetahui bahwa hal ini akan dibutuhkan saat proses sertifikasi?",
    options: [
      { value: "memiliki_dokumen_tambahan", label: "Ya, Memiliki Dokumen Tambahan", score: 2 },
      { value: "sedang_proses_memperoleh_dokumen", label: "Sedang Proses Memperoleh Dokumen", score: 1 },
      { value: "tidak_memiliki_dokumen_tambahan", label: "Tidak Memiliki Dokumen Tambahan", score: 0 },
    ],
  },
  {
    id: "q4",
    text: "4. Apakah Bapak/Ibu sudah menandatangani pernyataan komitmen sebagai petani sawit berkelanjutan (Smallholder Declaration)?",
    options: [
      { value: "sudah_menandatangani", label: "Ya, Sudah Menandatangani", score: 2 },
      { value: "sedang_proses_menandatangani", label: "Sedang Proses Menandatangani", score: 1 },
      { value: "tidak_menandatangani", label: "Tidak Menandatangani", score: 0 },
    ],
  },
  {
    id: "q5",
    text: "5. Apakah Bapak/Ibu bersedia menerapkan praktik pertanian yang baik di kebun sendiri sesuai prinsip RSPO?",
    options: [
      { value: "bersedia_menerapkan_praktik_baik", label: "Ya, Bersedia Menerapkan Praktik Baik", score: 2 },
      {
        value: "sedang_proses_menerapkan_praktik_baik",
        label: "Sedang Proses Menerapkan Praktik Baik",
        score: 1,
      },
      {
        value: "tidak_bersedia_menerapkan_praktik_baik",
        label: "Tidak Bersedia Menerapkan Praktik Baik",
        score: 0,
      },
    ],
  },
  {
    id: "q6",
    text: "6. Apakah Bapak/Ibu berkomitmen menerapkan praktik pertanian yang baik (GAP) di kebun?",
    options: [
      { value: "berkomitmen_menerapkan_gap", label: "Ya, Berkomitmen Menerapkan GAP", score: 2 },
      { value: "sedang_proses_menerapkan_gap", label: "Sedang Proses Menerapkan GAP", score: 1 },
      { value: "tidak_berkomitmen_menerapkan_gap", label: "Tidak Berkomitmen Menerapkan GAP", score: 0 },
    ],
  },
  {
    id: "q7",
    text: "7. Apakah Bapak/Ibu memiliki peta atau titik koordinat kebun, dan dapat menunjukkan bukti hak atas lahan tersebut (misalnya surat, warisan, hak adat)?",
    options: [
      { value: "memiliki_peta_dan_bukti_hak_lahan", label: "Ya, Memiliki Peta dan Bukti Hak Lahan", score: 2 },
      {
        value: "sedang_proses_memperoleh_peta_dan_bukti",
        label: "Sedang Proses Memperoleh Peta dan Bukti Hak Lahan",
        score: 1,
      },
      {
        value: "tidak_memiliki_peta_atau_bukti",
        label: "Tidak Memiliki Peta atau Bukti Hak Lahan",
        score: 0,
      },
    ],
    triggerSubQuestions: "tidak_memiliki_peta_atau_bukti",
    subQuestions: [
      {
        id: "q7_sub1",
        text: "7a. Jika belum memiliki dokumen, apakah Bapak/Ibu sedang dalam proses pengurusan legalisasi hak atas lahan tersebut?",
        options: [
          { value: "sedang_proses_legalisasi_hak_lahan_ya", label: "Ya, Sedang Proses Legalisasi", score: 2 },
          { value: "sedang_proses_legalisasi_lahan_proses", label: "Sedang Proses Legalisasi", score: 1 },
          { value: "tidak_sedang_proses_legalisasi_tidak", label: "Tidak Sedang Proses Legalisasi", score: 0 },
        ],
      },
    ],
  },
  {
    id: "q8",
    text: "8. Apakah lahan yang Bapak/Ibu miliki tidak berasal dari pengambilalihan milik masyarakat adat, komunitas lokal, atau pengguna lain?",
    options: [
      { value: "mengambil_alih_lahan_masyarakat", label: "Ya, Mengambil Alih Lahan Masyarakat", score: 2 },
      {
        value: "sedang_proses_mendapatkan_persetujuan",
        label: "Sedang Proses Mendapatkan Persetujuan Masyarakat",
        score: 1,
      },
      {
        value: "tidak_mengambil_alih_lahan_masyarakat",
        label: "Tidak Mengambil Alih Lahan Masyarakat",
        score: 0,
      },
    ],
    triggerSubQuestions: "mengambil_alih_lahan_masyarakat",
    subQuestions: [
      {
        id: "q8_sub1",
        text: "8a. Jika pernah mengambil lahan dari orang lain, apakah hal itu dilakukan dengan persetujuan dan tanpa paksaan?",
        options: [
          {
            value: "mendapatkan_persetujuan_masyarakat",
            label: "Ya, Mendapatkan Persetujuan Masyarakat",
            score: 2,
          },
          {
            value: "sedang_proses_mendapatkan_persetujuan_masyarakat",
            label: "Sedang Proses Mendapatkan Persetujuan",
            score: 1,
          },
          {
            value: "tidak_mendapatkan_persetujuan_masyarakat",
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
      { value: "mengetahui_fpic", label: "Ya, Mengetahui FPIC", score: 2 },
      { value: "sedang_proses_memahami_fpic", label: "Sedang Proses Memahami FPIC", score: 1 },
      { value: "tidak_mengetahui_fpic", label: "Tidak Mengetahui FPIC", score: 0 },
    ],
  },
  {
    id: "q10",
    text: "10. Apakah kebun Bapak/Ibu sedang dalam sengketa atau konflik dengan masyarakat lain?",
    options: [
      { value: "sedang_dalam_sengketa", label: "Ya, Sedang Dalam Sengketa", score: 2 },
      {
        value: "sedang_proses_penyelesaian_sengketa",
        label: "Sedang Proses Penyelesaian Sengketa",
        score: 1,
      },
      { value: "tidak_ada_sengketa", label: "Tidak Ada Sengketa", score: 0 },
    ],
    subQuestions: [
      {
        id: "q10_sub1",
        text: "10a. Jika ya, apakah Bapak/Ibu bersedia untuk menyelesaikannya melalui cara yang adil dan disepakati semua pihak?",
        triggerValue: "sedang_dalam_sengketa",
        options: [
          {
            value: "bersedia_menyelesaikan_sengketa_adil",
            label: "Ya, Bersedia Menyelesaikan Sengketa Secara Adil",
            score: 2,
          },
          {
            value: "sedang_proses_penyelesaian_sengketa_adil",
            label: "Sedang Proses Penyelesaian Sengketa",
            score: 1,
          },
          {
            value: "belum_bersedia_menyelesaikan_sengketa",
            label: "Belum Bersedia Menyelesaikan Sengketa",
            score: 0,
          },
        ],
      },
      {
        id: "q10_sub2",
        text: "10b. Jika tidak ada sengketa, apakah Bapak/Ibu memiliki bukti atau kesaksian bahwa lahan tersebut diterima oleh masyarakat sekitar?",
        triggerValue: "tidak_ada_sengketa",
        options: [
          { value: "memiliki_catatan_atau_bukti", label: "Ya, Memiliki Catatan atau Bukti", score: 2 },
          {
            value: "sedang_proses_mengumpulkan_bukti",
            label: "Sedang Proses Mengumpulkan Bukti",
            score: 1,
          },
          {
            value: "tidak_memiliki_catatan_atau_bukti",
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
      { value: "berada_di_kawasan_konservasi", label: "Ya, Berada Di Kawasan Konservasi", score: 2 },
      {
        value: "sedang_proses_verifikasi_lokasi",
        label: "Sedang Proses Verifikasi Lokasi Kebun",
        score: 1,
      },
      {
        value: "tidak_di_kawasan_konservasi",
        label: "Tidak, Kebun Tidak di Kawasan Konservasi",
        score: 0,
      },
    ],
  },
  {
    id: "q12",
    text: "12. Apakah Bapak/Ibu mengetahui bahwa kebun tidak boleh berada di dalam wilayah yang dilindungi secara hukum?",
    options: [
      { value: "mengetahui_hal_ini", label: "Ya, Mengetahui Hal Ini", score: 2 },
      {
        value: "sedang_proses_verifikasi_lokasi_kebun",
        label: "Sedang Proses Verifikasi Lokasi Kebun",
        score: 1,
      },
      { value: "tidak_mengetahui_hal_ini", label: "Tidak Mengetahui Hal Ini", score: 0 },
    ],
  },
  {
    id: "q13",
    text: "13. Apakah Bapak/Ibu memiliki rencana membuka kebun baru dalam waktu dekat?",
    options: [
      { value: "berencana_membuka_kebun_baru", label: "Ya, Berencana Membuka Kebun Baru", score: 2 },
      {
        value: "sedang_proses_membuka_kebun_baru",
        label: "Sedang Proses Membuka Kebun Baru",
        score: 1,
      },
      { value: "tidak_berencana_membuka_kebun_baru", label: "Tidak Berencana Membuka Kebun Baru", score: 0 },
    ],
    subQuestions: [
      {
        id: "q13_sub1",
        text: "13a. Jika ya, apakah Bapak/Ibu memahami bahwa tidak boleh membuka lahan dari masyarakat tanpa persetujuan mereka?",
        triggerValue: "berencana_membuka_kebun_baru",
        options: [
          { value: "memahami_hal_ini", label: "Ya, Memahami Hal Ini", score: 2 },
          {
            value: "sedang_proses_memahami_hal_ini",
            label: "Sedang Proses Memahami Hal Ini",
            score: 1,
          },
          { value: "tidak_memahami_hal_ini", label: "Tidak Memahami Hal Ini", score: 0 },
        ],
      },
    ],
  },
  {
    id: "q14",
    text: "14. Apakah Bapak/Ibu menggunakan tenaga kerja dari luar keluarga inti untuk membantu kegiatan di kebun? (Termasuk tenaga harian lepas, tetangga yang dibayar, buruh panen musiman, dll)",
    options: [
      {
        value: "menggunakan_tenaga_kerja_luar_keluarga",
        label: "Ya, Menggunakan Tenaga Kerja Luar Keluarga",
        score: 2,
      },
      {
        value: "sedang_proses_menggunakan_tenaga_kerja",
        label: "Sedang Proses Menggunakan Tenaga Kerja",
        score: 1,
      },
      {
        value: "tidak_menggunakan_tenaga_kerja_luar_keluarga",
        label: "Tidak Menggunakan Tenaga Kerja Luar Keluarga",
        score: 0,
      },
    ],
    subQuestions: [
      {
        id: "q14_sub1",
        text: "14a. Apakah semua tenaga kerja di kebun Bapak/Ibu bekerja secara sukarela dan tanpa paksaan? ",
        triggerValue: "menggunakan_tenaga_kerja_luar_keluarga",
        options: [
          { value: "semua_tenaga_kerja_sukarela", label: "Ya, Semua Tenaga Kerja Sukarela", score: 2 },
          {
            value: "sedang_proses_memberikan_kontrak_kerja",
            label: "Sedang Proses Memberikan Kontrak Kerja",
            score: 1,
          },
          {
            value: "tidak_semua_tenaga_kerja_sukarela",
            label: "Tidak Semua Tenaga Kerja Sukarela",
            score: 0,
          },
        ],
      },
      {
        id: "q14_sub2",
        text: "14b. Apakah Bapak/Ibu mengetahui dan memahami bahwa menggunakan tenaga kerja paksa tidak diperbolehkan dalam standar RSPO?",
        triggerValue: "menggunakan_tenaga_kerja_luar_keluarga",
        options: [
          {
            value: "memahami_pentingnya_kontrak_kerja",
            label: "Ya, Memahami Pentingnya Kontrak Kerja",
            score: 2,
          },
          {
            value: "sedang_proses_memahami_pentingnya_kontrak",
            label: "Sedang Proses Memahami Pentingnya Kontrak Kerja",
            score: 1,
          },
          {
            value: "tidak_memahami_pentingnya_kontrak",
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
      { value: "ada_anak_bekerja", label: "Ya, Ada Anak-anak Bekerja", score: 2 },
      {
        value: "sedang_proses_memastikan_anak_bekerja",
        label: "Sedang Proses Memastikan Anak-anak Bekerja",
        score: 1,
      },
      { value: "tidak_ada_anak_bekerja", label: "Tidak Ada Anak-anak Bekerja", score: 0 },
    ],
    subQuestions: [
      {
        id: "q15_sub1",
        text: "15a. Jika ada anak-anak yang membantu di kebun, apakah mereka hanya membantu keluarga, tidak mengganggu sekolah, dan tidak melakukan pekerjaan berat?",
        triggerValue: "ada_anak_bekerja",
        options: [
          {
            value: "anak_hanya_membantu_keluarga",
            label: "Ya, Anak-anak Hanya Membantu Keluarga",
            score: 2,
          },
          {
            value: "sedang_proses_memastikan_anak_membantu_keluarga",
            label: "Sedang Proses Memastikan Anak-anak Membantu Keluarga",
            score: 1,
          },
          { value: "anak_bekerja_berat", label: "Tidak, Anak-anak Bekerja Berat", score: 0 },
        ],
      },
    ],
  },
  {
    id: "q16",
    text: "16. Apakah Bapak/Ibu membayar pekerja (jika ada) sesuai dengan ketentuan upah minimum atau aturan lainnya yang berlaku di daerah Bapak/Ibu?",
    options: [
      { value: "membayar_pekerja_sesuai_aturan", label: "Ya, Membayar Pekerja Sesuai Aturan", score: 2 },
      {
        value: "sedang_proses_memastikan_pembayaran",
        label: "Sedang Proses Memastikan Pembayaran",
        score: 1,
      },
      {
        value: "tidak_membayar_pekerja_sesuai_aturan",
        label: "Tidak Membayar Pekerja Sesuai Aturan",
        score: 0,
      },
    ],
  },
  {
    id: "q17",
    text: "17. Apakah pekerja di kebun Bapak/Ibu tahu bahwa mereka berhak untuk menyampaikan keluhan jika ada masalah dalam pekerjaan?",
    options: [
      { value: "pekerja_tahu_hak_keluhan", label: "Ya, Pekerja Tahu Hak Keluhan", score: 2 },
      {
        value: "sedang_proses_memberitahu_pekerja",
        label: "Sedang Proses Memberitahu Pekerja",
        score: 1,
      },
      {
        value: "pekerja_tidak_tahu_hak_keluhan",
        label: "Tidak, Pekerja Tidak Tahu Hak Keluhan",
        score: 0,
      },
    ],
  },
  {
    id: "q18",
    text: "18. Apakah Bapak/Ibu sudah menyediakan kondisi kerja yang aman bagi pekerja di kebun, termasuk untuk keluarga sendiri jika membantu?",
    options: [
      { value: "kondisi_kerja_aman", label: "Ya, Kondisi Kerja Aman", score: 2 },
      {
        value: "sedang_proses_menciptakan_kondisi_aman",
        label: "Sedang Proses Menciptakan Kondisi Aman",
        score: 1,
      },
      { value: "kondisi_kerja_tidak_aman", label: "Tidak, Kondisi Kerja Tidak Aman", score: 0 },
    ],
    subQuestions: [
      {
        id: "q18_sub1",
        text: "18a.  Apakah Bapak/Ibu tahu bahwa menyediakan alat pelindung diri dan lingkungan kerja yang aman adalah bagian dari standar?",
        triggerValue: "kondisi_kerja_aman",
        options: [
          { value: "mengetahui_pentingnya_apd", label: "Ya, Mengetahui Pentingnya APD", score: 2 },
          {
            value: "sedang_proses_memahami_pentingnya_apd",
            label: "Sedang Proses Memahami Pentingnya APD",
            score: 1,
          },
          {
            value: "tidak_mengetahui_pentingnya_apd",
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
        value: "pernah_menyadari_perlakuan_tidak_adil_diskriminatif",
        label:
          "ya, Saya pernah menyadari adanya perlakuan tidak adil dan diskriminatif terhadap pekerja di kebun",
        score: 3,
      },
      {
        value: "tidak_pernah_menyadari_perlakuan_tidak_adil_diskriminatif",
        label:
          "Tidak, Saya tidak pernah menyadari adanya perlakuan tidak adil dan diskriminatif terhadap pekerja di kebun",
        score: 2,
      },
      {
        value: "sedang_proses_memahami_pentingnya_perlakuan_adil",
        label: "Sedang proses memahami pentingnya perlakuan adil",
        score: 2,
      },
    ],
    dependsOn: {
      questionId: "q14",
      requiredValue: "menggunakan_tenaga_kerja_luar_keluarga",
    },
  },
  {
    id: "q20",
    text: "20. Apakah Bapak/Ibu memahami bahwa tindakan kekerasan, pelecehan, atau diskriminasi terhadap pekerja tidak diperbolehkan?",
    options: [
      {
        value: "memahami_kekerasan_pelecehan_diskriminasi_tidak_diperbolehkan",
        label:
          "Ya, Saya memahami bahwa tindakan kekerasan, pelecehan, atau diskriminasi terhadap pekerja tidak diperbolehkan",
        score: 2,
      },
      {
        value: "tidak_memahami_kekerasan_pelecehan_diskriminasi_tidak_diperbolehkan",
        label:
          "Tidak, Saya tidak memahami bahwa tindakan kekerasan, pelecehan, atau diskriminasi terhadap pekerja tidak diperbolehkan",
        score: 0,
      },
      {
        value: "sedang_proses_memahami_pentingnya_perlakuan_adil_pekerja",
        label: "Sedang proses memahami pentingnya perlakuan adil",
        score: 1,
      },
    ],
    dependsOn: {
      questionId: "q14",
      requiredValue: "menggunakan_tenaga_kerja_luar_keluarga",
    },
  },
  {
    id: "q21",
    text: "21. Apakah Bapak/Ibu mengetahui adanya area konservasi atau hutan penting di sekitar lahan? ",
    options: [
      {
        value: "mengetahui_area_konservasi_hutan_penting_sekitar_lahan",
        label:
          "Ya, Saya mengetahui adanya area konservasi atau hutan penting di sekitar lahan",
        score: 2,
      },
      {
        value: "tidak_mengetahui_area_konservasi_hutan_penting_sekitar_lahan",
        label:
          "Tidak, Saya tidak mengetahui adanya area konservasi atau hutan penting di sekitar lahan",
        score: 0,
      },
      {
        value: "sedang_proses_memahami_pentingnya_konservasi",
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
            value: "mengetahui_pentingnya_menjaga_satwa_liar_ekosistem_ya",
            label:
              "Ya, Mengetahuai Penting nya Menjaga Satwa Liar dan Ekosistem di Sekitar Kebun",
            score: 2,
          },
          {
            value: "sedang_proses_memahami_pentingnya_menjaga_satwa_liar_ekosistem_proses",
            label:
              "Sedang Proses Memahami Pentingnya Menjaga Satwa Liar dan Ekosistem",
            score: 1,
          },
          {
            value: "tidak_mengetahui_pentingnya_menjaga_satwa_liar_ekosistem_tidak",
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
            value: "bersedia_ikut_pelatihan_pelestarian_lingkungan_satwa_langka_ya",
            label: "Ya, Berencana Melakukan Konservasi",
            score: 1,
          },
          {
            value: "mungkin_ikut_pelatihan_pelestarian_lingkungan_satwa_langka_mungkin",
            label: "Mungkin Akan Melakukan Konservasi",
            score: 1,
          },
          {
            value: "tidak_berencana_melakukan_konservasi_tidak",
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
      { value: "lahan_dibuka_setelah_2005", label: "Ya, Lahan Dibuka Setelah 2005", score: 2 },
      { value: "lahan_dibuka_sebelum_2005", label: "Tidak, Lahan Dibuka Sebelum 2005", score: 0 },
      {
        value: "sedang_proses_memahami_aturan_pembukaan_lahan",
        label: "Sedang Proses Memahami Aturan Pembukaan Lahan",
        score: 1,
      },
    ],
    subQuestions: [
      {
        id: "q22_sub1",
        text: "22a. Jika ya, apakah Bapak/Ibu bersedia untuk mengikuti proses identifikasi dan perbaikan lahan tersebut bersama kelompok?",
        triggerValue: "lahan_dibuka_setelah_2005",
        options: [
          {
            value: "bersedia_mengikuti_proses_identifikasi_perbaikan_lahan",
            label:
              "Ya, Bersedia Mengikuti Proses Identifikasi dan Perbaikan Lahan",
            score: 2,
          },
          {
            value: "sedang_proses_mengikuti_identifikasi_perbaikan_lahan",
            label:
              "Sedang Proses Mengikuti Proses Identifikasi dan Perbaikan Lahan",
            score: 1,
          },
          {
            value: "tidak_bersedia_mengikuti_proses_identifikasi_perbaikan_lahan",
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
        value: "berencana_menanam_kelapa_sawit_lahan_baru",
        label: "Ya, Berencana Menanam Kelapa Sawit di Lahan Baru",
        score: 2,
      },
      {
        value: "tidak_berencana_menanam_kelapa_sawit_lahan_baru",
        label: "Tidak, Tidak Berencana Menanam Kelapa Sawit di Lahan Baru",
        score: 0,
      },
      {
        value: "sedang_proses_memahami_pentingnya_tidak_menanam_lahan_baru",
        label: "Sedang Proses Memahami Pentingnya Tidak Menanam di Lahan Baru",
        score: 1,
      },
    ],
    subQuestions: [
      {
        id: "q23_sub1",
        text: "23a. Apakah Bapak/Ibu mengetahui bahwa menanam di hutan, gambut, atau lereng curam tidak diperbolehkan?",
        triggerValue: "berencana_menanam_kelapa_sawit_lahan_baru",
        options: [
          {
            value: "Mengetahui_aturan_Menanam_di_Lahan_Baru",
            label: "Ya, Mengetahui aturan Menanam di Lahan Baru",
            score: 2,
          },
          {
            value: "proses_Memahami_Aturan_Menanam_di_Lahan_Baru",
            label: "Sedang Proses Memahami Aturan Menanam di Lahan Baru",
            score: 1,
          },
          {
            value: "tidak_Mengetahui_Aturan_Menanam_di_Lahan_Baru",
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
      { value: "Memiliki_Lahan_di_Area_Gambut", label: "Ya, Memiliki Lahan di Area Gambut", score: 2 },
      {
        value: "tidak_Memiliki_Lahan_di_Area_Gambut",
        label: "Tidak, Tidak Memiliki Lahan di Area Gambut",
        score: 0,
      },
      {
        value: "proses_Memiliki_Lahan_di_Area_Gambut",
        label: "Sedang Proses Memahami Pentingnya Tidak Menanam di Area Gambut",
        score: 1,
      },
    ],
    subQuestions: [
      {
        id: "q24_sub1",
        text: "24a. Apakah Bapak/Ibu mengetahui pentingnya mengelola air dan mencegah kebakaran di lahan gambut?",
        triggerValue: "Memiliki_Lahan_di_Area_Gambut",
        options: [
          {
            value: "Mengetahui_Pentingnya_Mengelola_Air_dan_Mencegah_Kebakaran_di_Lahan_Gambut",
            label:
              "Ya, Mengetahui Pentingnya Mengelola Air dan Mencegah Kebakaran di Lahan Gambut",
            score: 2,
          },
          {
            value: "proses_Mengetahui_Pentingnya_Mengelola_Air_dan_Mencegah_Kebakaran_di_Lahan_Gambut",
            label:
              "Sedang Proses Memahami Pentingnya Mengelola Air dan Mencegah Kebakaran di Lahan Gambut",
            score: 1,
          },
          {
            value: "tidak_Mengetahui_Pentingnya_Mengelola_Air_dan_Mencegah_Kebakaran_di_Lahan_Gambut",
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
        value: "ya_Mengetahui_harus_Tanam_Ulang_di_Lahan_dengan_Risiko_Banjir/salinasi_Rendah",
        label:
          "Ya, Mengetahui harus Tanam Ulang di Lahan dengan Risiko Banjir/salinasi Rendah",
        score: 2,
      },
      {
        value: "tidak_Mengetahui_harus_Tanam_Ulang_di_Lahan_dengan_Risiko_Banjir/salinasi_Rendah",
        label:
          "Tidak, Tidak Mengetahui harus Tanam Ulang di Lahan dengan Risiko Banjir/salinasi Rendah",
        score: 0,
      },
      {
        value: "proses_Mengetahui_harus_Tanam_Ulang_di_Lahan_dengan_Risiko_Banjir/salinasi_Rendah",
        label:
          "Sedang Proses Memahami Pentingnya Tanam Ulang di Lahan dengan Risiko Banjir/salinasi Rendah",
        score: 1,
      },
    ],
    subQuestions: [
      {
        id: "q25_sub1",
        text: "25a. Apakah Bapak/Ibu siap melakukan penilaian risiko sebelum tanam ulang?",
        triggerValue: "ya_Mengetahui_harus_Tanam_Ulang_di_Lahan_dengan_Risiko_Banjir/salinasi_Rendah",
        options: [
          {
            value: "ya_Siap_Melakukan_Penilaian_Risiko_Sebelum_Tanam_Ulang",
            label: "Ya, Siap Melakukan Penilaian Risiko Sebelum Tanam Ulang",
            score: 2,
          },
          {
            value: "proses_Siap_Melakukan_Penilaian_Risiko_Sebelum_Tanam_Ulang",
            label:
              "Sedang Proses Memahami Pentingnya Penilaian Risiko Sebelum Tanam Ulang",
            score: 1,
          },
          {
            value: "tidak_Siap_Melakukan_Penilaian_Risiko_Sebelum_Tanam_Ulang",
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
        value: "Ya_Tidak_Pernah_Menggunakan_Api_untuk_Membuka_Lahan_atau_Mengelola_Limbah",
        label:
          "Ya, Tidak Pernah Menggunakan Api untuk Membuka Lahan atau Mengelola Limbah",
        score: 2,
      },
      {
        value: "Tidak_Pernah_Menggunakan_Api_untuk_Membuka_Lahan_atau_Mengelola_Limbah",
        label:
          "Tidak, Pernah Menggunakan Api untuk Membuka Lahan atau Mengelola Limbah",
        score: 0,
      },
      {
        value: "proses_Memahami_Pentingnya_Tidak_Menggunakan_Api",
        label: "Sedang Proses Memahami Pentingnya Tidak Menggunakan Api",
        score: 1,
      },
    ],
    subQuestions: [
      {
        id: "q26_sub1",
        text: "26a. Apakah Bapak/Ibu tahu bahwa penggunaan api tidak diperbolehkan dan ada cara lain yang lebih aman?",
        triggerValue: "Ya_Tidak_Pernah_Menggunakan_Api_untuk_Membuka_Lahan_atau_Mengelola_Limbah",
        options: [
          {
            value: "ya_Mengetahui_Penggunaan_Api_Tidak_Diperbolehkan",
            label: "Ya, Mengetahui Penggunaan Api Tidak Diperbolehkan",
            score: 2,
          },
          {
            value: "proses_Mengetahui_Penggunaan_Api_Tidak_Diperbolehkan",
            label: "Sedang Proses Memahami Penggunaan Api Tidak Diperbolehkan",
            score: 1,
          },
          {
            value: "tidak_Mengetahui_Penggunaan_Api_Tidak_Diperbolehkan",
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
      { value: "ya_mengetahui_batas_sungai_di_kebun", label: "Ya, Mengetahui Batas Sungai di Kebun", score: 2 },
      {
        value: "tidak_mengetahui_batas_sungai_di_kebun",
        label: "Tidak, Tidak Mengetahui Batas Sungai di Kebun",
        score: 0,
      },
      {
        value: "proses_memahami_pentingnya_mengetahui_batas_sungai_di_kebun",
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
            value: "ya_mengetahui_tidak_boleh_menanam_di_area_sempadan_sungai",
            label: "Ya, Mengetahui Tidak Boleh Menanam di Area Sempadan Sungai",
            score: 2,
          },
          {
            value: "proses_memahami_tidak_boleh_menanam_di_area_sempadan_sungai",
            label:
              "Sedang Proses Memahami Tidak Boleh Menanam di Area Sempadan Sungai",
            score: 1,
          },
          {
            value: "tidak_mengetahui_tidak_boleh_menanam_di_area_sempadan_sungai",
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
      { value: "ya_menggunakan_pestisida_berbahaya", label: "Ya, Menggunakan Pestisida Berbahaya", score: 2 },
      {
        value: "tidak_menggunakan_pestisida_berbahaya",
        label: "Tidak Menggunakan Pestisida Berbahaya",
        score: 0,
      },
      {
        value: "proses_memahami_pentingnya_tidak_menggunakan_pestisida_berbahaya",
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
            value: "ya_mengetahui_pestisida_harus_digunakan_dengan_aman",
            label: "Ya, Mengetahui Pestisida Harus Digunakan dengan Aman",
            score: 2,
          },
          {
            value: "proses_memahami_pestisida_harus_digunakan_dengan_aman",
            label:
              "Sedang Proses Memahami Pestisida Harus Digunakan dengan Aman",
            score: 1,
          },
          {
            value: "tidak_mengetahui_pestisida_harus_digunakan_dengan_aman",
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
        value: "ya_kelompok_memiliki_prosedur_rencana_tanam_baru",
        label: "Ya, Kelompok Memiliki Prosedur Rencana Tanam Baru",
        score: 2,
      },
      {
        value: "tidak_kelompok_tidak_memiliki_prosedur_rencana_tanam_baru",
        label: "Tidak, Kelompok Tidak Memiliki Prosedur Rencana Tanam Baru",
        score: 0,
      },
      {
        value: "proses_memahami_pentingnya_prosedur_rencana_tanam_baru",
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
          { value: "ya_telah_difasilitasi", label: "Ya, telah difasilitasi", score: 2 },
          { value: "proses_memfasilitasi", label: "Sedang Proses memfasilitasi", score: 1 },
          {
            value: "tidak_diberikan_fasilitas",
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
        value: "ya_kelompok_memiliki_catatan_petani_lahan_gambut",
        label:
          "Ya, Kelompok memiliki catatan petani yang memiliki lahan gambut",
        score: 2,
      },
      {
        value: "tidak_kelompok_tidak_memiliki_catatan_petani_lahan_gambut",
        label:
          "Tidak, Kelompok Tidak Memiliki catatan petani yang memiliki lahan gambut",
        score: 0,
      },
      {
        value: "proses_mencatat_petani_lahan_gambut",
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
            value: "ya_kelompok_sudah_memetakan_area",
            label:
              "Ya, Kelompok sudah memetakan area dan menyimpannya sebagai dokumen kelompok",
            score: 2,
          },
          {
            value: "tidak_kelompok_belum_memetakan_area",
            label: "Tidak, Kelompok belum memetakan area",
            score: 0,
          },
          {
            value: "proses_memetakan_area",
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
        value: "ya_kelompok_mencatat_petani_membuka_lahan_dibakar",
        label:
          "Ya, Kelompok telah memeriksa dan mencatat petani baru yang pernah membuka lahan dengan cara dibakar",
        score: 2,
      },
      {
        value: "tidak_kelompok_mencatat_petani_membuka_lahan_dibakar",
        label:
          "Tidak, Kelompok belum mencatat dan memeriksa petani baru yang pernah membuka lahan dengan cara dibakar",
        score: 0,
      },
      {
        value: "proses_mencatat_petani_membuka_lahan_dibakar",
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
            value: "ya_kelompok_memiliki_catatan_historis_penggunaan_api",
            label: "Ya, Kelompok memiliki catatan historis penggunaan api",
            score: 2,
          },
          {
            value: "tidak_kelompok_tidak_memiliki_catatan_historis_penggunaan_api",
            label:
              "Tidak, Kelompok tidak memiliki catatan historis penggunaan api",
            score: 0,
          },
          {
            value: "proses_mencatat_historis_penggunaan_api",
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
        value: "ya_kelompok_memiliki_daftar_pestisida_anggota",
        label:
          "Ya, Kelompok memiliki daftar pestisida yang digunakan oleh anggota",
        score: 2,
      },
      {
        value: "tidak_kelompok_memiliki_daftar_pestisida_anggota",
        label:
          "Tidak, Kelompok tidak memiliki daftar pestisida yang digunakan oleh anggota",
        score: 0,
      },
      {
        value: "proses_mencatat_daftar_pestisida_anggota",
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
            value: "ya_kelompok_menyimpan_informasi_tentang_pestisida",
            label: "Ya, Kelompok menyimpan informasi tentang pestisida",
            score: 2,
          },
          {
            value: "tidak_kelompok_tidak_menyimpan_informasi_tentang_pestisida",
            label:
              "Tidak, Kelompok tidak menyimpan informasi tentang pestisida",
            score: 0,
          },
          {
            value: "proses_menyimpan_informasi_tentang_pestisida",
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
        value: "ya_mengikuti_pelatihan_mekanisme_harga_tbs",
        label:
          "Ya, saya pernah mengikuti pelatihan terkait mekanisme harga tandan buah segar (TBS) kelapa sawit",
        score: 2,
      },
      {
        value: "tidak_mengikuti_pelatihan_mekanisme_harga_tbs",
        label:
          "Tidak, saya tidak pernah mengikuti pelatihan terkait mekanisme harga tandan buah segar (TBS) kelapa sawit",
        score: 0,
      },
      {
        value: "proses_daftar_pelatihan_mekanisme_harga_tbs",
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
        value: "ya_memahami_pengaturan_keuangan_kelompok",
        label:
          "Ya, saya memahami bagaimana kelompok mengatur keuangan secara transparan dan bertanggung jawab",
        score: 2,
      },
      {
        value: "tidak_memahami_pengaturan_keuangan_kelompok",
        label:
          "Tidak, saya tidak memahami bagaimana kelompok mengatur keuangan secara transparan dan bertanggung jawab",
        score: 0,
      },
      {
        value: "proses_memahami_pengaturan_keuangan_kelompok",
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
        value: "ya_mengetahui_aturan_kelompok_petani_sawit",
        label:
          "Ya, saya mengetahui aturan atau praktik terbaik dalam mengelola kelompok petani sawit",
        score: 2,
      },
      {
        value: "tidak_mengetahui_aturan_kelompok_petani_sawit",
        label:
          "Tidak, saya tidak mengetahui aturan atau praktik terbaik dalam mengelola kelompok petani sawit",
        score: 0,
      },
      {
        value: "proses_memahami_aturan_kelompok_petani_sawit",
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
        value: "ya_kelompok_punya_sistem_pencatatan_petani",
        label:
          "Ya, kelompok sudah punya sistem sederhana untuk mencatat, memeriksa, dan menindak jika ada petani yang tidak ikut aturan",
        score: 2,
      },
      {
        value: "tidak_kelompok_punya_sistem_pencatatan_petani",
        label:
          "Tidak, kelompok tidak memiliki sistem sederhana untuk mencatat, memeriksa, dan menindak jika ada petani yang tidak ikut aturan",
        score: 0,
      },
      {
        value: "proses_membuat_sistem_pencatatan_petani",
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
        value: "ya_anggota_kelompok_tahu_aturan_dasar",
        label:
          "Ya, semua anggota kelompok sudah tahu aturan-aturan dasar ini dan menjalankannya",
        score: 2,
      },
      {
        value: "tidak_anggota_kelompok_tahu_aturan_dasar",
        label:
          "Tidak, semua anggota kelompok belum mengetahui aturan-aturan dasar ini dan menjalankannya",
        score: 0,
      },
      {
        value: "proses_memahami_aturan_dasar_kelompok",
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
        value: "ya_kelompok_menyelenggarakan_pelatihan_anggota",
        label:
          "Ya, kelompok sudah menyelenggarakan pelatihan untuk anggota tentang harga TBS, pengelolaan keuangan, dan organisasi petani sawit",
        score: 2,
      },
      {
        value: "tidak_kelompok_menyelenggarakan_pelatihan_anggota",
        label:
          "Tidak, kelompok belum menyelenggarakan pelatihan untuk anggota tentang harga TBS, pengelolaan keuangan, dan organisasi petani sawit",
        score: 0,
      },
      {
        value: "proses_menyelenggarakan_pelatihan_anggota",
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
        value: "ya_mengikuti_pelatihan_pengelolaan_usaha_kebun",
        label:
          "Ya, saya pernah mengikuti pelatihan mengenai pengelolaan usaha kebun, seperti perencanaan, pencatatan, atau pengawasan kebun",
        score: 2,
      },
      {
        value: "tidak_mengikuti_pelatihan_pengelolaan_usaha_kebun",
        label:
          "Tidak, saya tidak pernah mengikuti pelatihan mengenai pengelolaan usaha kebun, seperti perencanaan, pencatatan, atau pengawasan kebun",
        score: 0,
      },
      {
        value: "proses_pendaftaran_pelatihan_pengelolaan_usaha_kebun",
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
        value: "ya_melakukan_pencatatan_hasil_panen",
        label:
          "Ya, saya melakukan pencatatan hasil panen, penggunaan pupuk, benih, atau biaya di kebun",
        score: 2,
      },
      {
        value: "tidak_melakukan_pencatatan_hasil_panen",
        label:
          "Tidak, saya tidak pernah melakukan pencatatan hasil panen, penggunaan pupuk, benih, atau biaya di kebun",
        score: 0,
      },
      {
        value: "proses_melakukan_pencatatan_hasil_panen",
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
            value: "jumlah_panen_dan_jenis_benih",
            label: "Jumlah panen dan Jenis benih",
            score: 0,
          },
          {
            value: "biaya_pupuk",
            label: "biaya pupuk",
            score: 0,
          },
          {
            value: "transaksi_jual_beli",
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
            value: "ya_terbantu_dengan_pencatatan_kebun",
            label:
              "Ya, saya merasa terbantu dengan adanya pencatatan tersebut dalam mengelola kebun",
            score: 2,
          },
          {
            value: "tidak_terbantu_dengan_pencatatan_kebun",
            label:
              "Tidak, saya merasa tidak terbantu dengan adanya pencatatan tersebut dalam mengelola kebun",
            score: 0,
          },
          {
            value: "proses_mencatat_dan_mengetahui_manfaat_pencatatan",
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
        value: "ya_mengikuti_pelatihan_cara_bertani_sawit_baik",
        label:
          "Ya, saya pernah mengikuti pelatihan tentang cara bertani sawit yang baik",
        score: 2,
      },
      {
        value: "tidak_mengikuti_pelatihan_cara_bertani_sawit_baik",
        label:
          "Tidak, saya tidak pernah mengikuti pelatihan tentang cara bertani sawit yang baik",
        score: 0,
      },
      {
        value: "proses_pendaftaran_pelatihan_cara_bertani_sawit_baik",
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
            value: "ya_dalam_pelatihan_dibahas_materi_tersebut",
            label: "Ya, dalam pelatihan dibahas materi tersebut",
            score: 2,
          },
          {
            value: "tidak_dalam_pelatihan_tidak_dibahas_materi_tersebut",
            label: "Tidak, dalam pelatihan tidak dibahas materi tersebut",
            score: 0,
          },
          {
            value: "sedang_dalam_pelatihan_dan_belum_mengetahui_materi_tersebut_dibahas_atau_tidak",
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
            value: "ya_saya_jadi_mengetahui_tentang_cara_bertani_sawit_yang_baik",
            label:
              "Ya, saya jadi mengetahui tentang cara bertani sawit yang baik",
            score: 2,
          },
          {
            value: "tidak_saya_tidak_tahu_apa_apa",
            label: "Tidak, saya tidak tahu apa - apa",
            score: 0,
          },
          {
            value: "sedang_proses_memahami_materi_pelatihan",
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
        value: "ya_memiliki_bukti_lahan",
        label: "Ya, saya memiliki bukti",
        score: 2,
      },
      {
        value: "tidak_memiliki_bukti_lahan",
        label: "Tidak, saya tidak memiliki bukti",
        score: 0,
      },
      {
        value: "proses_mengurus_dokumen_bukti_lahan",
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
            value: "sedang_mengurus_dokumen_ya",
            label: "Ya, saya sedang mengurus dokumen tersebut",
            score: 2,
          },
          {
            value: "tidak_mengurus_dokumen_tidak",
            label: "Tidak, saya tidak sedang mengurus dokumen tersebut",
            score: 0,
          },
          {
            value: "proses_pengurusan_dokumen_proses",
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
        value: "ya_lahan_dari_warisan_pembelian_adat",
        label:
          "Ya, lahan yang saya kelola dari warisan/pembelian/kesepakatan adat",
        score: 2,
      },
      {
        value: "tidak_lahan_dari_warisan_pembelian_adat",
        label:
          "Tidak, lahan yang saya kelola bukan dari warisan/pembelian/kesepakatan adat",
        score: 0,
      },
      {
        value: "proses_memahami_lahan_yang_saya_kelola",
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
            value: "ya_ada_peta",
            label: "Ya",
            score: 2,
          },
          {
            value: "tidak_ada_peta",
            label: "Tidak",
            score: 0,
          },
          {
            value: "ya_sedang_dalam_proses_pengurusan",
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
        value: "ya_memperoleh_lahan_dari_masyarakat_adat",
        label:
          "Ya, lahan yang saya peroleh dari masyarakat adat/komunitas lokal/orang lain",
        score: 2,
      },
      {
        value: "tidak_memperoleh_lahan_dari_keluarga",
        label: "Tidak, lahan yang saya peroleh dari keluarga saya",
        score: 0,
      },
      {
        value: "proses_memahami_lahan_yang_saya_punya",
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
            value: "ya_ada_kesepakatan",
            label: "Ya",
            score: 2,
          },
          {
            value: "tidak_ada_kesepakatan",
            label: "Tidak",
            score: 0,
          },
          {
            value: "ya_sedang_dalam_proses_persetujuan",
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
        value: "ya_memperoleh_lahan_secara_sukarela",
        label: "Ya, secara sukarela dan tanpa tekanan dari pihak manapun",
        score: 2,
      },
      {
        value: "tidak_memperoleh_lahan_dengan_tekanan",
        label: "Tidak, lahan yang saya peroleh terdapat tekanan",
        score: 0,
      },
      {
        value: "proses_memahami_proses_memperoleh_lahan",
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
        value: "ya_bisa_menjelaskan_proses_komunikasi_persetujuan",
        label: "Ya, secara sukarela dan tanpa tekanan dari pihak manapun",
        score: 2,
      },
      {
        value: "tidak_bisa_menjelaskan_proses_komunikasi_persetujuan",
        label: "Tidak, lahan yang saya peroleh terdapat tekanan",
        score: 0,
      },
      {
        value: "proses_memahami_proses_komunikasi_persetujuan",
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
        value: "ya_lahan_sedang_disengketakan",
        label: "Ya, lahan saya sedang disengketakan",
        score: 2,
      },
      {
        value: "tidak_lahan_tidak_disengketakan",
        label: "Tidak, lahan saya tidak disengketakan",
        score: 0,
      },
      {
        value: "proses_lahan_sedang_disengketakan",
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
            value: "ya_sedang_ada_proses_penyelesaian_yang_disepakati",
            label: "Ya, sedang ada proses penyelesaian yang disepakati",
            score: 2,
          },
          {
            value: "tidak_tidak_ada_proses_penyelesaian_yang_disepakati",
            label: "Tidak, tidak ada proses penyelesaian yang disepakati",
            score: 0,
          },
          {
            value: "ya_sedang_dalam_proses_pembicaraan",
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
        value: "ya_pernah_mengikuti_pelatihan_persetujuan_masyarakat",
        label: "Ya, saya pernah mengikuti pelatihan",
        score: 2,
      },
      {
        value: "tidak_pernah_mengikuti_pelatihan_persetujuan_masyarakat",
        label: "Tidak, saya tidak pernah mengikuti",
        score: 0,
      },
      {
        value: "proses_memahami_pendaftaran_pelatihan_persetujuan_masyarakat",
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
        value: "ya_pernah_mengikuti_pelatihan_hak_pekerja",
        label: "Ya, saya pernah mengikuti pelatihan",
        score: 2,
      },
      {
        value: "tidak_pernah_mengikuti_pelatihan_hak_pekerja",
        label: "Tidak, saya tidak pernah mengikuti",
        score: 0,
      },
      {
        value: "proses_memahami_pendaftaran_pelatihan_hak_pekerja",
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
        value: "ya_memastikan_pekerja_bekerja_sukarela",
        label:
          "Ya, saya memastikan bahwa semua pekerja bekerja secara sukarela",
        score: 2,
      },
      {
        value: "tidak_memastikan_pekerja_bekerja_sukarela",
        label:
          "Tidak, saya tidak memastikan bahwa semua pekerja bekerja secara sukarela",
        score: 0,
      },
      {
        value: "proses_memastikan_pekerja_bekerja_sukarela",
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
        value: "ya_ada_dokumen_identitas_pekerja",
        label: "Ya, ada",
        score: 2,
      },
      {
        value: "tidak_ada_dokumen_identitas_pekerja",
        label: "Tidak ada",
        score: 0,
      },
      {
        value: "proses_administrasi_dokumen_identitas_pekerja",
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
        value: "ya_pekerja_diminta_membayar_biaya",
        label:
          "Ya, pekerja diminta untuk membayar biaya saat pertama kali bekerja",
        score: 2,
      },
      {
        value: "tidak_pekerja_tidak_diminta_membayar_biaya",
        label:
          "Tidak, pekerja tidak diminta untuk membayar biaya saat pertama kali bekerja",
        score: 0,
      },
      {
        value: "proses_pendaftaran_pekerja",
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
        value: "ya_ada_perjanjian_tertulis",
        label: "Ya, ada perjanjian tertulis",
        score: 2,
      },
      {
        value: "tidak_ada_perjanjian_tertulis",
        label: "Tidak, tidak ada perjanjian tertulis",
        score: 0,
      },
      {
        value: "proses_pembuatan_perjanjian",
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
        value: "ya_pekerja_bebas_mengundurkan_diri",
        label: "Ya, pekerja bebas mengundurkan diri tanpa ancaman atau denda",
        score: 2,
      },
      {
        value: "tidak_pekerja_dipersulit_mengundurkan_diri",
        label:
          "Tidak, pekerja dipersulit untuk mengundurkan diri dan terdapat denda dan ancaman",
        score: 0,
      },
      {
        value: "proses_melihat_pekerja",
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
        value: "ya_ada_sistem_lembur_sukarela",
        label: "Ya, ada sistem lembur dan dilakukan secara sukarela",
        score: 2,
      },
      {
        value: "tidak_tidak_ada_sistem_lembur",
        label: "Tidak, pekerja tidak ada sistem lembur",
        score: 0,
      },
      {
        value: "proses_sistem_lembur_tidak_sukarela",
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
        value: "ya_pernah_ada_gaji_ditahan",
        label: "Ya, pernah ada",
        score: 2,
      },
      {
        value: "tidak_pernah_ada_gaji_ditahan",
        label: "Tidak pernah ada",
        score: 0,
      },
      {
        value: "proses_sistem_tidak_ada_penahanan_gaji",
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
        value: "ya_memahami_arti_kerja_paksa",
        label:
          "Ya, saya memahami arti kerja paksa dan bagaimana menghindarinya",
        score: 2,
      },
      {
        value: "tidak_memahami_arti_kerja_paksa",
        label:
          "Tidak, saya tidak memahami arti kerja paksa dan bagaimana menghindarinya",
        score: 0,
      },
      {
        value: "proses_memahami_arti_kerja_paksa",
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
        value: "ya_mengetahui_dan_mengikuti_aturan_anak",
        label: "Ya, saya mengetahui dan mengikuti aturan nya",
        score: 2,
      },
      {
        value: "tidak_mengetahui_dan_mengikuti_aturan_anak",
        label: "Tidak, saya tidak mengetahui dan tidak mengikuti aturan nya",
        score: 0,
      },
      {
        value: "proses_mengetahui_aturan_anak",
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
        value: "ya_memiliki_aturan_tertulis_pekerja_anak",
        label: "Ya, saya memiliki aturan tertulis",
        score: 2,
      },
      {
        value: "tidak_memiliki_aturan_tertulis_pekerja_anak",
        label: "Tidak, saya tidak memiliki aturan tertulis",
        score: 0,
      },
      {
        value: "proses_membuat_aturan_tertulis_pekerja_anak",
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
        value: "ya_sudah_disosialisasikan_aturan_pekerja_anak",
        label: "Ya, sudah disosialisasikan",
        score: 2,
      },
      {
        value: "tidak_sudah_disosialisasikan_aturan_pekerja_anak",
        label: "Tidak, belum disosialisasikan",
        score: 0,
      },
      {
        value: "proses_disosialisasikan_aturan_pekerja_anak",
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
        value: "ya_sudah_memeriksa_rutin_pelanggaran",
        label: "Ya, sudah memeriksa secara rutin",
        score: 2,
      },
      {
        value: "tidak_sudah_memeriksa_rutin_pelanggaran",
        label: "Tidak, belum memeriksa",
        score: 0,
      },
      {
        value: "proses_pemeriksaan_pelanggaran",
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
        value: "ya_pekerja_dibayar_sesuai_upah_minimum",
        label: "Ya, pekerja dibayar sesuai upah minimum yang berlaku",
        score: 2,
      },
      {
        value: "tidak_pekerja_dibayar_sesuai_upah_minimum",
        label: "Tidak, pekerja tidak dibayar sesuai upah minimum yang berlaku",
        score: 0,
      },
      {
        value: "proses_membuat_kesepakatan_upah_dengan_pekerja",
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
        value: "ya_pekerja_dibayar_dengan_adil",
        label: "Ya, pekerja dibayar dengan adil",
        score: 2,
      },
      {
        value: "tidak_pekerja_dibayar_dengan_adil",
        label: "Tidak, pekerja tidak dibayar dengan adil",
        score: 0,
      },
      {
        value: "proses_membuat_kesepakatan_upah_dengan_pekerja_adil",
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
        value: "ya_pernah_mengikuti_pelatihan_hak_pekerja",
        label: "Ya, Pernah mengikuti pelatihan",
        score: 2,
      },
      {
        value: "tidak_pernah_mengikuti_pelatihan_hak_pekerja",
        label: "Tidak Pernah mengikuti pelatihan",
        score: 0,
      },
      {
        value: "proses_mengikuti_pelatihan_hak_pekerja",
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
        value: "ya_sudah_memberitahu_cara_keluhan_pekerja",
        label: "Ya, sudah memberitahu kepada pekerja",
        score: 2,
      },
      {
        value: "tidak_sudah_memberitahu_cara_keluhan_pekerja",
        label: "Tidak, Belum memberitahu kepada pekerja",
        score: 0,
      },
      {
        value: "proses_memberitahu_cara_keluhan_pekerja",
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
        value: "ya_mengikuti_pelatihan_keselamatan_kerja",
        label:
          "Ya, mengikuti pelatihan tentang keselamatan kerja dikebun sawit",
        score: 2,
      },
      {
        value: "tidak_mengikuti_pelatihan_keselamatan_kerja",
        label:
          "Tidak, Belum mengikuti pelatihan tentang keselamatan kerja dikebun sawit",
        score: 0,
      },
      {
        value: "proses_pendaftaran_pelatihan_keselamatan_kerja",
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
        value: "ya_menggunakan_alat_pelindung",
        label: "Ya, saya menggunakan alat pelindung",
        score: 2,
      },
      {
        value: "tidak_menggunakan_alat_pelindung",
        label: "Tidak, saya tidak memakai alat pelindung",
        score: 0,
      },
      {
        value: "proses_pembelian_alat_pelindung",
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
        value: "ya_menyediakan_alat_pelindung_untuk_pekerja",
        label: "Ya, saya menyediakan alat pelindung yang sesuai untuk mereka",
        score: 2,
      },
      {
        value: "tidak_menyediakan_alat_pelindung_untuk_pekerja",
        label:
          "Tidak, saya tidak menyediakan alat pelindung yang sesuai untuk mereka",
        score: 0,
      },
      {
        value: "proses_pembelian_alat_pelindung_untuk_pekerja",
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
        value: "ya_mengetahui_bahaya_pekerjaan",
        label: "Ya, saya mengetahui nya",
        score: 2,
      },
      {
        value: "tidak_mengetahui_bahaya_pekerjaan",
        label: "Tidak, saya tidak mengetahui resiko nya",
        score: 0,
      },
      {
        value: "proses_pembelajaran_bahaya_pekerjaan",
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
        value: "ya_pernah_mengikuti_pelatihan_diskriminasi",
        label: "Ya, pernah mengikuti pelatihan/penyuluhan",
        score: 2,
      },
      {
        value: "tidak_pernah_mengikuti_pelatihan_diskriminasi",
        label: "Tidak, tidak pernah mengikuti pelatihan/penyuluhan",
        score: 0,
      },
      {
        value: "proses_pendaftaran_pelatihan_diskriminasi",
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
        value: "ya_memahami_pentingnya_lingkungan_kerja_aman",
        label:
          "Ya, memahami pentingnya menciptakan lingkungan kerja yang aman dan saling menghormati",
        score: 2,
      },
      {
        value: "tidak_memahami_pentingnya_lingkungan_kerja_aman",
        label: "Tidak, saya tidak memahami materi pelatihan",
        score: 0,
      },
      {
        value: "proses_pendaftaran_pelatihan_lingkungan_kerja_aman",
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
        value: "ya_menerapkan_hal_dari_pelatihan",
        label: "Ya, saya menerapkan hal-hal dari pelatihan",
        score: 2,
      },
      {
        value: "tidak_menerapkan_hal_dari_pelatihan",
        label: "Tidak, saya tidak menerapkan materi pelatihan",
        score: 0,
      },
      {
        value: "proses_pendaftaran_pelatihan_penerapan",
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
        value: "ya_pernah_mengikuti_pelatihan_hutan",
        label: "Ya, saya pernah mengikuti pelatihan",
        score: 2,
      },
      {
        value: "tidak_pernah_mengikuti_pelatihan_hutan",
        label: "Tidak, saya tidak pernah mengikuti pelatihan",
        score: 0,
      },
      {
        value: "proses_pendaftaran_pelatihan_hutan",
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
        value: "ya_paham_area_penting_alam",
        label: "Ya, saya paham bahwa itu bisa mengganggu keseimbangan alam",
        score: 2,
      },
      {
        value: "tidak_paham_area_penting_alam",
        label: "Tidak, saya tidak mengerti",
        score: 0,
      },
      {
        value: "proses_pembelajaran_area_penting_alam",
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
        value: "ya_mengetahui_cara_menangani_hewan_liar",
        label: "Ya, saya mengetahui nya",
        score: 2,
      },
      {
        value: "tidak_mengetahui_cara_menangani_hewan_liar",
        label: "Tidak, saya tidak mengetahui",
        score: 0,
      },
      {
        value: "proses_pembelajaran_cara_menangani_hewan_liar",
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
        value: "ya_mengetahui_cara_menangani_hewan_liar_tanpa_bahaya",
        label: "Ya, saya mengetahui nya",
        score: 2,
      },
      {
        value: "tidak_mengetahui_cara_menangani_hewan_liar_tanpa_bahaya",
        label: "Tidak, saya tidak mengetahuinya",
        score: 0,
      },
      {
        value: "proses_pembelajaran_cara_menangani_hewan_liar_tanpa_bahaya",
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
        value: "ya_mengetahui_hewan_tumbuhan_langka",
        label: "Ya, saya mengetahui nya",
        score: 2,
      },
      {
        value: "tidak_mengetahui_hewan_tumbuhan_langka",
        label: "Tidak, saya tidak mengetahuinya",
        score: 0,
      },
      {
        value: "proses_pembelajaran_hewan_tumbuhan_langka",
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
        value: "ya_mengetahui_lahan_kebun_dulu_hutan",
        label: "Ya, saya mengetahui nya",
        score: 2,
      },
      {
        value: "tidak_mengetahui_lahan_kebun_dulu_hutan",
        label: "Tidak, saya tidak mengetahui nya",
        score: 0,
      },
      {
        value: "proses_pembelajaran_lahan_kebun_dulu_hutan",
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
        value: "ya_mengikuti_kegiatan_kelompok_memperbaiki_hutan",
        label: "Ya, saya mengikuti kegiatan kelompok",
        score: 2,
      },
      {
        value: "tidak_mengikuti_kegiatan_kelompok_memperbaiki_hutan",
        label: "Tidak, saya tidak mengikuti kegiatan kelompok",
        score: 0,
      },
      {
        value: "proses_mencari_dan_mengikuti_kegiatan_memperbaiki_hutan",
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
        value: "ya_mengetahui_rencana_kelompok_memperbaiki_lahan",
        label: "Ya, saya mengetahuinya",
        score: 2,
      },
      {
        value: "tidak_mengetahui_rencana_kelompok_memperbaiki_lahan",
        label: "Tidak, saya tidak mengetahuinya",
        score: 0,
      },
      {
        value: "proses_mencari_dan_mengikuti_kegiatan_memperbaiki_lahan",
        label: "Sedang proses mencari dan mengikuti kegiatan",
        score: 1,
      },
    ],
  },
  {
    id: "q200_49a",
    text: "49. Apakah Bapak/Ibu tahu bahaya apa saja yang bisa terjadi saat menggunakan pestisida, alat tajam, atau saat panen?",
    options: [
      {
        value: "ya_mengetahui_bahaya_saat_kerja",
        label: "Ya, saya mengetahui nya",
        score: 2,
      },
      {
        value: "tidak_mengetahui_bahaya_saat_kerja",
        label: "Tidak, saya tidak mengetahui resiko nya",
        score: 0,
      },
      {
        value: "proses_pembelajaran_bahaya_saat_kerja",
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
        value: "ya_kelompok_memiliki_catatan_peta_lahan",
        label: "Ya, kelompok petani memiliki catatan/peta tentang lahan",
        score: 2,
      },
      {
        value: "tidak_kelompok_memiliki_catatan_peta_lahan",
        label:
          "Tidak, kelompok petani tidak memiliki catatan/peta tentang lahan",
        score: 0,
      },
      {
        value: "proses_pencarian_data_catatan_kelompok_petani",
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
        value: "ya_kelompok_sudah_menyusun_rencana_memulihkan_lahan",
        label:
          "Ya, kelompok sudah menyusun rencana bersama petani untuk memulihkan kembali sebagian lahan",
        score: 2,
      },
      {
        value: "tidak_kelompok_sudah_menyusun_rencana_memulihkan_lahan",
        label:
          "Tidak, kelompok belum menyusun rencana bersama petani untuk memulihkan kembali sebagian lahan",
        score: 0,
      },
      {
        value: "proses_penyusunan_rencana_memulihkan_lahan",
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
        value: "ya_sudah_dikirimkan_ke_rspo",
        label: "Ya, sudah dikirimkan/dikonsultasikan ke RSPO",
        score: 2,
      },
      {
        value: "tidak_sudah_dikirimkan_ke_rspo",
        label: "Tidak, belum dikirimkan/dikonsultasikan ke RSPO",
        score: 0,
      },
      {
        value: "proses_pengiriman_ke_rspo",
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
        value: "ya_sudah_menyusun_rencana_bersama",
        label: "Ya, saya sudah menyusun rencana bersama",
        score: 2,
      },
      {
        value: "tidak_sudah_menyusun_rencana_bersama",
        label: "Tidak, saya belum menyusun rencana bersama",
        score: 0,
      },
      {
        value: "proses_penyusunan_rencana_bersama",
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
        value: "ya_sudah_dibahas_cara_menjaga_kawasan_penting",
        label: "Ya, sudah dibahas",
        score: 2,
      },
      {
        value: "tidak_sudah_dibahas_cara_menjaga_kawasan_penting",
        label: "Tidak, belum ada pembahasan tersebut",
        score: 0,
      },
      {
        value: "proses_pembahasan_cara_menjaga_kawasan_penting",
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
        value: "ya_rencana_disusun_bersama_sama",
        label:
          "Ya, rencana ini disusun secara bersama-sama dengan melibatkan semua anggota kelompok yang berkepentingan",
        score: 2,
      },
      {
        value: "tidak_rencana_disusun_bersama_sama",
        label: "Tidak, rencana ini tidak disusun secara bersama-sama",
        score: 0,
      },
      {
        value: "proses_penyusunan_rencana_bersama_sama",
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
        value: "ya_pernah_membantu_petani_menyusun_rencana_tanam",
        label:
          "Ya, pernah membantu petani menyusun rencana tanam baru bersama-sama",
        score: 2,
      },
      {
        value: "tidak_pernah_membantu_petani_menyusun_rencana_tanam",
        label:
          "Tidak, belum pernah membantu petani menyusun rencana tanam baru bersama-sama",
        score: 0,
      },
      {
        value: "proses_membantu_petani_menyusun_rencana_tanam",
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
        value: "ya_sudah_dipastikan_tidak_ada_hutan_penting",
        label: "Ya, sudah dipastikan tidak ada hutan penting",
        score: 2,
      },
      {
        value: "tidak_sudah_dipastikan_tidak_ada_hutan_penting",
        label: "Tidak, belum dipastikan tidak ada hutan penting",
        score: 0,
      },
      {
        value: "proses_memastikan_tidak_ada_hutan_penting",
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
        value: "ya_proses_penyusunan_rencana_dicatat_didokumentasikan",
        label:
          "Ya, proses penyusunan rencana ini dicatat dan didokumentasikan oleh kelompok sebelum petani mulai membuka lahan",
        score: 2,
      },
      {
        value: "tidak_proses_penyusunan_rencana_dicatat_didokumentasikan",
        label:
          "Tidak, proses penyusunan rencana ini belum dicatat dan didokumentasikan oleh kelompok sebelum petani mulai membuka lahan",
        score: 0,
      },
      {
        value: "proses_penyusunan_rencana_dan_pencatatan_dokumentasi",
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
        value: "ya_pernah_mengikuti_pelatihan_menanam_sawit_di_tanah_gambut",
        label:
          "Ya, saya pernah mengikuti pelatihan tentang cara menanam sawit di tanah gambut",
        score: 2,
      },
      {
        value: "proses_pendaftaran_mengikuti_pelatihan_menanam_sawit_di_tanah_gambut",
        label: "Sedang Proses pendaftaran mengikuti pelatihan",
        score: 1,
      },
      {
        value: "tidak_pernah_mengikuti_pelatihan_menanam_sawit_di_tanah_gambut",
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
            value: "ya_sudah_menerapkan_cara_cara_yang_diajarkan_dalam_pelatihan",
            label:
              "Ya, Sudah menerapkan cara-cara yang diajarkan dalam pelatihan",
            score: 2,
          },
          {
            value: "proses_memahami_materi_pelatihan",
            label: "Sedang Proses memahami materi pelatihan",
            score: 1,
          },
          {
            value: "tidak_menerapkan_cara_cara_yang_diajarkan_dalam_pelatihan",
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
        value: "ya_kelompok_memiliki_rencana_panduan_tertulis_mengelola_lahan_gambut",
        label:
          "Ya, kelompok memiliki rencana dan panduan tertulis untuk membantu petani mengelola lahan gambut",
        score: 2,
      },
      {
        value: "tidak_kelompok_memiliki_rencana_panduan_tertulis_mengelola_lahan_gambut",
        label:
          "Tidak, kelompok belum memiliki rencana dan panduan tertulis untuk membantu petani mengelola lahan gambut",
        score: 0,
      },
      {
        value: "proses_membuat_rencana_panduan_tertulis_mengelola_lahan_gambut",
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
        value: "ya_kelompok_memantau_dan_mendampingi_petani",
        label:
          "Ya, kelompok memantau dan mendampingi petani dalam menerapkan rencana tersebut",
        score: 2,
      },
      {
        value: "tidak_kelompok_memantau_dan_mendampingi_petani",
        label:
          "Tidak, kelompok tidak memantau dan mendampingi petani dalam menerapkan rencana tersebut",
        score: 0,
      },
      {
        value: "proses_memantau_dan_mendampingi_petani",
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
        value: "ya_kelompok_memiliki_sistem_kegiatan_khusus_mengatur_air_lahan_gambut",
        label:
          "Ya, kelompok memiliki sistem atau kegiatan khusus untuk memantau dan mengatur air dilahan gambut milik petani",
        score: 2,
      },
      {
        value: "tidak_kelompok_memiliki_sistem_kegiatan_khusus_mengatur_air_lahan_gambut",
        label:
          "Tidak, kelompok belum memiliki sistem atau kegiatan khusus untuk memantau dan mengatur air dilahan gambut milik petani",
        score: 0,
      },
      {
        value: "proses_membuat_sistem_kegiatan_khusus_mengatur_air_lahan_gambut",
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
        value: "ya_memiliki_rencana_menanam_ulang_di_lahan_gambut",
        label: "Ya, saya memiliki rencana untuk menanam ulang di lahan gambut",
        score: 2,
      },
      {
        value: "tidak_memiliki_rencana_menanam_ulang_di_lahan_gambut",
        label:
          "Tidak, saya tidak memiliki rencana untuk menanam ulang di lahan gambut",
        score: 0,
      },
      {
        value: "proses_menimbang_rencana_menanam_ulang_di_lahan_gambut",
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
        value: "ya_pernah_mengikuti_pelatihan_resiko_banjir_air_asin_di_lahan_gambut",
        label:
          "Ya, saya pernah mengikuti pelatihan yang membahas resiko banjir atau air asin (salinitas) di lahan gambut",
        score: 2,
      },
      {
        value: "tidak_pernah_mengikuti_pelatihan_resiko_banjir_air_asin_di_lahan_gambut",
        label: "Tidak, saya tidak pernah mengikuti pelatihan",
        score: 0,
      },
      {
        value: "proses_pendaftaran_pelatihan_resiko_banjir_air_asin_di_lahan_gambut",
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
        value: "ya_dalam_pelatihan_terdapat_materi_alternatif_cara_lain_memanfaatkan_lahan",
        label:
          "Ya, dalam pelatihan terdapat materi alternatif cara lain memanfaatkan lahan jika terjadi resiko tinggi",
        score: 2,
      },
      {
        value: "tidak_dalam_pelatihan_tidak_dijelaskan_materi_alternatif_cara_lain_memanfaatkan_lahan",
        label:
          "Tidak, dalam pelatihan tidak dijelaskan materi alternatif cara lain memanfaatkan lahan jika terjadi resiko tinggi",
        score: 0,
      },
      {
        value: "proses_memahami_materi_pelatihan_alternatif_cara_lain_memanfaatkan_lahan",
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
        value: "ya_kelompok_memfasilitasi_pelatihan_petani_resiko_banjir_salinitas_lahan_gambut",
        label:
          "Ya, kelompok memfasilitasi pelatihan kepada petani tentang resiko banjir dan salinitas dilahan gambut",
        score: 2,
      },
      {
        value: "tidak_kelompok_memfasilitasi_pelatihan_petani_resiko_banjir_salinitas_lahan_gambut",
        label:
          "Tidak, kelompok belum memfasilitasi pelatihan kepada petani tentang resiko banjir dan salinitas dilahan gambut",
        score: 0,
      },
      {
        value: "proses_rencana_memfasilitasi_pelatihan_petani_resiko_banjir_salinitas_lahan_gambut",
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
        value: "ya_kelompok_menginformasikan_dan_mendampingi_petani_pengelolaan_lahan_lain_selain_sawit_di_lahan_gambut",
        label:
          "Ya, kelompok menginformasikan dan mendampingi petani tentang pilihan pengelolaan lahan lain selain sawit dilahan gambut",
        score: 2,
      },
      {
        value: "tidak_kelompok_menginformasikan_dan_mendampingi_petani_pengelolaan_lahan_lain_selain_sawit_di_lahan_gambut",
        label:
          "Tidak, kelompok belum menginformasikan dan mendampingi petani tentang pilihan pengelolaan lahan lain selain sawit dilahan gambut",
        score: 0,
      },
      {
        value: "proses_menginformasikan_dan_mendampingi_petani_pengelolaan_lahan_lain_selain_sawit_di_lahan_gambut",
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
        value: "ya_pernah_mengikuti_pelatihan_sosialisasi_membuka_lahan_dan_mengelola_kebun_tanpa_membakar",
        label:
          "Ya, saya pernah mengikuti pelatihan atau sosialisasi tentang cara membuka lahan dan mengelola kebun tanpa membakar",
        score: 2,
      },
      {
        value: "tidak_pernah_mengikuti_pelatihan_sosialisasi_membuka_lahan_dan_mengelola_kebun_tanpa_membakar",
        label:
          "Tidak, saya belum pernah mengikuti pelatihan atau sosialiasi tentang cara membuka lahan dan mengelola kebun tanpa membakar",
        score: 0,
      },
      {
        value: "proses_merencanakan_mengikuti_pelatihan_membuka_lahan_dan_mengelola_kebun_tanpa_membakar",
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
        value: "ya_mengetahui_cara_mencegah_dan_apa_yang_harus_dilakukan",
        label: "Ya, saya mengetahui cara mencegah dan apa yang harus dilakukan",
        score: 2,
      },
      {
        value: "tidak_mengetahui_cara_mencegah_dan_apa_yang_harus_dilakukan",
        label:
          "Tidak, saya tidak mengetahui cara mencegah dan apa yang harus dilakukan",
        score: 0,
      },
      {
        value: "proses_mempelajari_cara_mencegah_dan_apa_yang_harus_dilakukan",
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
        value: "ya_masih_menggunakan_api_untuk_membuka_lahan",
        label: "Ya, masih",
        score: 2,
      },
      {
        value: "tidak_menggunakan_api_untuk_membuka_lahan",
        label: "Tidak",
        score: 0,
      },
      {
        value: "proses_merencanakan_tidak_menggunakan_api_untuk_membuka_lahan",
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
        value: "ya_kelompok_mencatat_atau_memantau_penggunaan_api_oleh_petani",
        label:
          "Ya, kelompok mencatat atau memantau adanya penggunaan api oleh petani",
        score: 2,
      },
      {
        value: "tidak_kelompok_mencatat_atau_memantau_penggunaan_api_oleh_petani",
        label:
          "Tidak, kelompok belum mencatat atau memantau adanya penggunaan api oleh petani",
        score: 0,
      },
      {
        value: "proses_merencanakan_mencatat_atau_memantau_penggunaan_api_oleh_petani",
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
        value: "ya_menyelenggarakan_pelatihan_sosialisasi_kepada_anggota_pencegahan_dan_penanggulangan_kebakaran",
        label:
          "Ya, menyelenggarakan pelatihan/sosialisasi kepada anggota tentang pencegahan dan penanggulangan kebakaran",
        score: 2,
      },
      {
        value: "tidak_menyelenggarakan_pelatihan_sosialisasi_kepada_anggota_pencegahan_dan_penanggulangan_kebakaran",
        label:
          "Tidak ada menyelenggarakan pelatihan/sosialisasi kepada anggota tentang pencegahan dan penanggulangan kebakaran",
        score: 0,
      },
      {
        value: "proses_merencanakan_menyelenggarakan_pelatihan_sosialisasi_kepada_anggota_pencegahan_dan_penanggulangan_kebakaran",
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
        value: "ya_mengetahui_zona_penyangga_sungai",
        label: "Ya, saya mengetahui ",
        score: 2,
      },
      {
        value: "tidak_mengetahui_zona_penyangga_sungai",
        label: "Tidak saya tidak mengetahui",
        score: 0,
      },
      {
        value: "proses_memahami_materi_zona_penyangga_sungai",
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
        value: "ya_pernah_mengikuti_pelatihan_sosialisasi_pengelolaan_zona_penyangga_sungai",
        label:
          "Ya, saya pernah mengikuti pelatihan/sosialisasi terkait pengelolaan zona penyangga sungai",
        score: 2,
      },
      {
        value: "tidak_pernah_mengikuti_pelatihan_sosialisasi_pengelolaan_zona_penyangga_sungai",
        label:
          "Tidak, saya tidak pernah mengikuti pelatihan/sosialisasi terkait pengelolaan zona penyangga sungai",
        score: 0,
      },
      {
        value: "proses_pendaftaran_mengikuti_pelatihan_pengelolaan_zona_penyangga_sungai",
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
        value: "ya_kelompok_memiliki_rencana_panduan_tertulis_menjaga_memperbaiki_kondisi_zona_penyangga_sungai",
        label:
          "Ya, kelompok memiliki rencana atau panduan tertulis untuk menjaga atau memperbaiki kondisi zona penyangga sungai",
        score: 2,
      },
      {
        value: "tidak_kelompok_memiliki_rencana_panduan_tertulis_menjaga_memperbaiki_kondisi_zona_penyangga_sungai",
        label:
          "Tidak, kelompok tidak memiliki rencana atau panduan tertulis untuk menjaga atau memperbaiki kondisi zona penyangga sungai",
        score: 0,
      },
      {
        value: "proses_merencanakan_membuat_panduan_tertulis_menjaga_memperbaiki_kondisi_zona_penyangga_sungai",
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
        value: "ya_sudah_menyampaikan_dan_mendiskusikan_rencana_dengan_para_anggota",
        label:
          "Ya, sudah menyampaikan dan mendiskusikan rencana tersebut dengan para anggota",
        score: 2,
      },
      {
        value: "tidak_sudah_menyampaikan_dan_mendiskusikan_rencana_dengan_para_anggota",
        label:
          "Tidak, belum ada penyampaian dan mendiskusikan rencana tersebut dengan para anggota",
        score: 0,
      },
      {
        value: "proses_merencanakan_penyampaian_dan_mendiskusikan_rencana_dengan_para_anggota",
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
        value: "ya_pernah_mendapatkan_pelatihan_penggunaan_pestisida",
        label:
          "Ya, saya pernah mendapatkan pelatihan tentang penggunaan pestisida",
        score: 2,
      },
      {
        value: "tidak_pernah_mendapatkan_pelatihan_penggunaan_pestisida",
        label:
          "Tidak, saya belum pernah mendapatkan pelatihan tentang penggunaan pestisida",
        score: 0,
      },
      {
        value: "proses_mendaftar_pelatihan_penggunaan_pestisida",
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
        value: "ya_sudah_mengetahui_pestisida_berbahaya_dilarang_dipakai",
        label: "Ya, saya sudah mengetahui nya",
        score: 2,
      },
      {
        value: "tidak_sudah_mengetahui_pestisida_berbahaya_dilarang_dipakai",
        label: "Tidak, saya belum mengetahuinya",
        score: 0,
      },
      {
        value: "proses_memahami_materi_pelatihan_pestisida_berbahaya_dilarang_dipakai",
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
        value: "mengetahui_ibu_hamil_tidak_boleh_terpapar_pestisida",
        label: "Ya, saya sudah mengetahui nya",
        score: 2,
      },
      {
        value: "belum_mengetahui_ibu_hamil_tidak_boleh_terpapar_pestisida",
        label: "Tidak, saya belum mengetahui nya",
        score: 0,
      },
      {
        value: "proses_memahami_ibu_hamil_tidak_boleh_terpapar_pestisida",
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
        value: "kelompok_pernah_menyelenggarakan_pelatihan_pestisida_aman",
        label:
          "Ya, kelompok pernah menyelenggarakan atau memfasilitasi pelatihan tentang penggunaan pestisida yang aman",
        score: 2,
      },
      {
        value: "kelompok_tidak_pernah_menyelenggarakan_pelatihan_pestisida_aman",
        label:
          "Tidak, kelompok tidak pernah menyelenggarakan atau memfasilitasi pelatihan tentang penggunaan pestisida yang aman",
        score: 0,
      },
      {
        value: "kelompok_sedang_proses_merencanakan_pelatihan_pestisida_aman",
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
        value: "kelompok_mencatat_memantau_jenis_pestisida",
        label:
          "Ya, kelompok mencatat dan memantau jenis pestisida yang digunakan oleh petani",
        score: 2,
      },
      {
        value: "kelompok_belum_mencatat_memantau_jenis_pestisida",
        label:
          "Tidak, kelompok belum mencatat dan memantau jenis pestisida yang digunakan oleh petani",
        score: 0,
      },
      {
        value: "kelompok_sedang_proses_merencanakan_mencatat_memantau_pestisida",
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
        value: "ya_pernah_mengikuti_pelatihan_mengelola_hama_gulma_tanaman_pengganggu",
        label:
          "Ya, saya pernah mengikuti pelatihan tentang cara mengelola hama, gulma dan tanaman pengganggu lainnya",
        score: 2,
      },
      {
        value: "tidak_pernah_mengikuti_pelatihan_mengelola_hama_gulma_tanaman_pengganggu",
        label:
          "Tidak, saya tidak pernah mengikuti pelatihan tentang cara mengelola hama, gulma dan tanaman pengganggu lainnya",
        score: 0,
      },
      {
        value: "proses_pendaftaran_pelatihan_mengelola_hama_gulma_tanaman_pengganggu",
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
        value: "ya_mengetahui_cara_mengendalikan_hama_tanpa_pestisida",
        label: "Ya, saya mengetahui nya",
        score: 2,
      },
      {
        value: "tidak_mengetahui_cara_mengendalikan_hama_tanpa_pestisida",
        label: "Tidak, saya tidak mengetahui nya",
        score: 0,
      },
      {
        value: "proses_memahami_materi_cara_mengendalikan_hama_tanpa_pestisida",
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
        value: "ya_kelompok_pernah_memfasilitasi_pelatihan_ipm_bahan_kimia_aman",
        label:
          "Ya, kelompok pernah memfasilitasi pelatihan kepada anggota terkait pengendalian hama terpadu (IPM) dan penggunaan bahan kimia yang aman",
        score: 2,
      },
      {
        value: "tidak_kelompok_pernah_memfasilitasi_pelatihan_ipm_bahan_kimia_aman",
        label:
          "Tidak, kelompok tidak pernah memfasilitasi pelatihan kepada anggota terkait pengendalian hama terpadu (IPM) dan penggunaan bahan kimia yang aman",
        score: 0,
      },
      {
        value: "proses_merencanakan_memfasilitasi_pelatihan_ipm_bahan_kimia_aman",
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
        value: "ya_kelompok_menyimpan_materi_pelatihan_pengendalian_gulma",
        label: "Ya, kelompok menyimpan dan memiliki materi pelatihan",
        score: 2,
      },
      {
        value: "tidak_kelompok_menyimpan_materi_pelatihan_pengendalian_gulma",
        label: "Tidak, kelompok tidak menyimpan dan memiliki materi pelatihan",
        score: 0,
      },
      {
        value: "proses_menyimpan_materi_pelatihan_pengendalian_gulma",
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
        value: "kadang_proses",
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
        value: "ya_mencatat_transaksi_penjualan_tbs",
        label: "Ya, saya mencatat transaksi penjualan TBS",
        score: 2,
      },
      {
        value: "mungkin",
        label: "Kadang saya mencatat transaksi penjualan TBS",
        score: 1,
      },
      {
        value: "tidak_mencatat_transaksi_penjualan_tbs",
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
        value: "ya_menggunakan_catatan_hasil_panen_dan_penjualan",
        label:
          "Ya, saya menggunakan catatan hasil panen dan penjualan tersebut untuk membantu mengelola dan merencanakan kegiatan kebun",
        score: 2,
      },
      {
        value: "tidak_menggunakan_catatan_hasil_panen_dan_penjualan",
        label:
          "Tidak, saya tidak pernah menggunakan catatan hasil panen dan penjualan tersebut untuk membantu mengelola dan merencanakan kegiatan kebun",
        score: 0,
      },
      {
        value: "sedang_proses_menggunakan_catatan_hasil_panen_dan_penjualan",
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
        value: "ya_menerapkan_praktik_pertanian_baik_di_kebun",
        label:
          "Ya, saya sudah mulai menerapkan praktik-praktik pertanian yang baik di kebun",
        score: 2,
      },
      {
        value: "tidak_menerapkan_praktik_pertanian_baik_di_kebun",
        label:
          "Tidak, saya belum menerapkan praktik-praktik pertanian yang baik di kebun",
        score: 0,
      },
      {
        value: "sedang_proses_menerapkan_praktik_pertanian_baik_di_kebun",
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
        value: "ya_mencatat_hasil_panen_dan_penjualan_tbs_secara_teratur",
        label:
          "Ya, saya mencatat hasil panen dan penjualan TBS dari kebun secara teratur",
        score: 2,
      },
      {
        value: "tidak_mencatat_hasil_panen_dan_penjualan_tbs_secara_teratur",
        label:
          "Tidak, saya tidak pernah mencatat hasil panen dan penjualan TBS dari kebun secara teratur",
        score: 0,
      },
      {
        value: "sedang_proses_mencatat_hasil_panen_dan_penjualan_tbs_secara_teratur",
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
        value: "ya_batas_lahan_sudah_ditandai_dengan_jelas",
        label:
          "Ya, batas lahan sudah ditandai dengan jelas dan terlihat di lapangan",
        score: 2,
      },
      {
        value: "tidak_batas_lahan_belum_ditandai_dengan_jelas",
        label:
          "Tidak, batas lahan belum ditandai dengan jelas dan terlihat di lapangan",
        score: 0,
      },
      {
        value: "sedang_proses_membuat_tanda_batas_lahan",
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
        value: "ya_berdiskusi_dengan_masyarakat_sekitar_sebelum_membuka_kebun",
        label:
          "Ya, saya pernah berdiskusi atau bermusyawarah dengan masyarakat sekitar/adat/pihak lain sebelum membuka kebun baru",
        score: 2,
      },
      {
        value: "tidak_berdiskusi_dengan_masyarakat_sekitar_sebelum_membuka_kebun",
        label:
          "Tidak, saya tidak pernah berdiskusi atau bermusyawarah dengan masyarakat sekitar/adat/pihak lain sebelum membuka kebun baru",
        score: 0,
      },
      {
        value: "sedang_proses_berdiskusi_dengan_masyarakat_sekitar_sebelum_membuka_kebun",
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
        value: "ya_membuat_kesepakatan_atau_rencana_bersama_sebelum_membuka_lahan",
        label:
          "Ya, saya telah membuat kesepakatan atau rencana bersama sebelum membuka lahan sawit baru",
        score: 2,
      },
      {
        value: "tidak_membuat_kesepakatan_atau_rencana_bersama_sebelum_membuka_lahan",
        label:
          "Tidak, saya belum membuat kesepakatan atau rencana bersama sebelum membuka lahan sawit baru",
        score: 0,
      },
      {
        value: "sedang_proses_membuat_kesepakatan_atau_rencana_bersama_sebelum_membuka_lahan",
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
        value: "ya_kelompok_memfasilitasi_proses_diskusi_dan_musyawarah",
        label:
          "Ya, kelompok telah memfasilitasi proses diskusi dan musyawarag antara petani dan masyarakat yang terdampak",
        score: 2,
      },
      {
        value: "tidak_kelompok_memfasilitasi_proses_diskusi_dan_musyawarah",
        label:
          "Tidak, kelompok belum memfasilitasi proses diskusi dan musyawarag antara petani dan masyarakat yang terdampak",
        score: 0,
      },
      {
        value: "sedang_proses_memfasilitasi_proses_diskusi_dan_musyawarah",
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
        value: "ya_pekerja_menyimpan_sendiri_dokumen_identitas",
        label: "Ya, menyimpan sendiri dokumen identitas mereka",
        score: 2,
      },
      {
        value: "tidak_pekerja_menyimpan_sendiri_dokumen_identitas",
        label: "Tidak menyimpan sendiri dokumen identitas mereka",
        score: 0,
      },
      {
        value: "sedang_proses_pekerja_menyimpan_dokumen_identitas",
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
        value: "ya_pekerja_bebas_pergi_kemana_saja_diluar_jam_kerja",
        label:
          "Ya, pekerja bebas pergi kemana saja di luar jam kerja tanpa harus meminta izin atau pengawasan",
        score: 2,
      },
      {
        value: "tidak_pekerja_bebas_pergi_kemana_saja_diluar_jam_kerja",
        label:
          "Tidak, pekerja tidak bebas pergi kemana saja diluar jam kerja dan harus meminta izin atau pengawasan",
        score: 0,
      },
      {
        value: "sedang_proses_pekerja_bebas_pergi_kemana_saja_diluar_jam_kerja",
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
        value: "ya_pekerja_bekerja_secara_sukarela_dan_tidak_dipaksa",
        label:
          "Ya, pekerja mengatakan bahwa mereka bekerja secara sukarela dan tidak dipaksa",
        score: 2,
      },
      {
        value: "tidak_pekerja_bekerja_secara_sukarela_dan_tidak_dipaksa",
        label:
          "Tidak, pekerja tidak mengatakan bahwa mereka bekerja secara sukarela dan tidak dipaksa",
        score: 0,
      },
      {
        value: "sedang_proses_pekerja_bekerja_secara_sukarela_dan_tidak_dipaksa",
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
        value: "ya_pekerja_menerima_upah_sesuai_dengan_yang_sudah_disepakati",
        label:
          "Ya, pekerja menerima upah sesuai dengan yang sudah disepakati dan minimal sesuai upah minumum yang berlaku",
        score: 2,
      },
      {
        value: "tidak_pekerja_menerima_upah_sesuai_dengan_yang_sudah_disepakati",
        label:
          "Tidak, pekerja tidak menerima upah sesuai dengan yang sudah disepakati dan minimal sesuai upah minumum yang berlaku",
        score: 0,
      },
      {
        value: "sedang_proses_pekerja_menerima_upah_sesuai_dengan_yang_sudah_disepakati",
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
        value: "ya_memberikan_upah_dan_perlakuan_yang_adil_kepada_semua_pekerja",
        label:
          "Ya, saya memberikan upah dan perlakuan yang adil kepada semua pekerja, termasuk perempuan dan kelompok rentan lainnya",
        score: 2,
      },
      {
        value: "tidak_memberikan_upah_dan_perlakuan_yang_adil_kepada_semua_pekerja",
        label:
          "Tidak, saya tidak memberikan upah dan perlakuan yang adil kepada semua pekerja, termasuk perempuan dan kelompok rentan lainnya",
        score: 0,
      },
      {
        value: "sedang_proses_memberikan_upah_dan_perlakuan_yang_adil_kepada_semua_pekerja",
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
        value: "ya_terdapat_perbedaan_upah_antara_pekerja_laki_laki_dan_perempuan",
        label:
          "Ya, terdapat perbedaan upah antara pekerja laki-laki dan perempuan untuk jenis pekerjaan yang sama",
        score: 2,
      },
      {
        value: "tidak_terdapat_perbedaan_upah_antara_pekerja_laki_laki_dan_perempuan",
        label:
          "Tidak, tidak terdapat perbedaan upah antara pekerja laki-laki dan perempuan untuk jenis pekerjaan yang sama",
        score: 0,
      },
      {
        value: "sedang_proses_terdapat_perbedaan_upah_antara_pekerja_laki_laki_dan_perempuan",
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
        value: "ya_pekerja_mengetahui_kemana_harus_mengadu_jika_mereka_punya_masalah_di_tempat_kerja",
        label:
          "Ya, pekerja mengetahui kemana harus mengadu jika mereka punya masalah di tempat kerja",
        score: 2,
      },
      {
        value: "tidak_pekerja_mengetahui_kemana_harus_mengadu_jika_mereka_punya_masalah_di_tempat_kerja",
        label:
          "Tidak, pekerja tidak mengetahui kemana harus mengadu jika mereka punya masalah di tempat kerja",
        score: 0,
      },
      {
        value: "sedang_proses_memberitahu_pekerja_kemana_harus_mengadu_jika_mereka_punya_masalah_di_tempat_kerja",
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
        value: "ya_sudah_ada_cara_atau_prosedur_yang_jelas_bagi_pekerja_untuk_menyampaikan_keluhan",
        label:
          "Ya, sudah ada cara atau prosedur yang jelas bagi pekerja untuk menyampaikan keluhan",
        score: 2,
      },
      {
        value: "tidak_ada_cara_atau_prosedur_yang_jelas_bagi_pekerja_untuk_menyampaikan_keluhan",
        label:
          "Tidak ada cara atau prosedur yang jelas bagi pekerja untuk menyampaikan keluhan",
        score: 0,
      },
      {
        value: "sedang_proses_membuat_cara_atau_prosedur_yang_jelas_bagi_pekerja_untuk_menyampaikan_keluhan",
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
        value: "ya_pekerja_memiliki_tempat_tinggal_yang_aman_dan_layak",
        label: "Ya, pekerja memiliki tempat tinggal yang aman dan layak",
        score: 2,
      },
      {
        value: "tidak_pekerja_memiliki_tempat_tinggal_yang_aman_dan_layak",
        label:
          "Tidak, pekerja tidak memiliki tempat tinggal yang aman dan layak",
        score: 0,
      },
      {
        value: "sedang_proses_membangun_tempat_tinggal_yang_aman_dan_layak_bagi_pekerja",
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
        value: "ya_tersedia_kotak_p3k",
        label: "Ya, tersedia kotak P3K",
        score: 2,
      },
      {
        value: "tidak_tersedia_kotak_p3k",
        label: "Tidak tersedia kotak P3K",
        score: 0,
      },
      {
        value: "sedang_proses_membeli_kotak_p3k",
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
        value: "ya_pekerja_menggunakan_alat_pelindung_diri_apd",
        label: "Ya, pekerja menggunakan alat pelindung diri (APD)",
        score: 2,
      },
      {
        value: "tidak_pekerja_menggunakan_alat_pelindung_diri_apd",
        label: "Tidak, pekerja tidak menggunakan alat pelindung diri (APD)",
        score: 0,
      },
      {
        value: "sedang_proses_membeli_alat_pelindung_diri_apd",
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
        value: "ya_tersedia_air_minum_yang_cukup_dan_bersih_untuk_pekerja_di_kebun",
        label:
          "Ya, tersedia air minum yang cukup dan bersih untuk pekerja di kebun",
        score: 2,
      },
      {
        value: "tidak_tersedia_air_minum_yang_cukup_dan_bersih_untuk_pekerja_di_kebun",
        label:
          "Tidak tersedia air minum yang cukup dan bersih untuk pekerja di kebun",
        score: 0,
      },
      {
        value: "sedang_proses_membuat_air_minum_yang_cukup_dan_bersih_untuk_pekerja_di_kebun",
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
        value: "ya_pekerja_memiliki_akses_ke_toilet_yang_layak",
        label: "Ya, pekerja memiliki akses ke toilet yang layak",
        score: 2,
      },
      {
        value: "tidak_pekerja_memiliki_akses_ke_toilet_yang_layak",
        label: "Tidak, pekerja tidak memiliki akses ke toilet yang layak",
        score: 0,
      },
      {
        value: "sedang_proses_membuat_akses_toilet_yang_layak",
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
        value: "ya_mengetahui_para_petani_anggota_menyediakan_tempat_tinggal_layak_bagi_pekerja_mereka",
        label:
          "Ya, saya mengetahui bahwa para petani anggota menyediakan tempat tinggal layak bagi pekerja mereka",
        score: 2,
      },
      {
        value: "tidak_mengetahui_para_petani_anggota_menyediakan_tempat_tinggal_layak_bagi_pekerja_mereka",
        label:
          "Tidak, saya tidak mengetahui bahwa para petani anggota menyediakan tempat tinggal layak bagi pekerja mereka",
        score: 0,
      },
      {
        value: "sedang_proses_mencari_tahu_para_petani_anggota_menyediakan_tempat_tinggal_layak_bagi_pekerja_mereka",
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
        value: "ya_kelompok_memantau_ketersediaan_kotak_p3k_di_kebun_anggota",
        label: "Ya, kelompok memantau ketersediaan kotak P3K di kebun anggota",
        score: 2,
      },
      {
        value: "tidak_kelompok_memantau_ketersediaan_kotak_p3k_di_kebun_anggota",
        label:
          "Tidak, kelompok tidak memantau ketersediaan kotak P3K di kebun anggota",
        score: 0,
      },
      {
        value: "sedang_proses_memantau_ketersediaan_kotak_p3k_di_kebun_anggota",
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
        value: "ya_kelompok_memberikan_pelatihan_atau_pendampingan_terkait_pemakaian_apd_oleh_pekerja_petani",
        label:
          "Ya, kelompok memberikan pelatihan atau pendampingan terkait pemakaian APD oleh pekerja petani",
        score: 2,
      },
      {
        value: "tidak_kelompok_memberikan_pelatihan_atau_pendampingan_terkait_pemakaian_apd_oleh_pekerja_petani",
        label:
          "Tidak, kelompok tidak memberikan pelatihan atau pendampingan terkait pemakaian APD oleh pekerja petani",
        score: 0,
      },
      {
        value: "sedang_proses_memberikan_pelatihan_atau_pendampingan_terkait_pemakaian_apd_oleh_pekerja_petani",
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
        value: "ya_memastikan_adanya_akses_air_minum_dan_toilet_bagi_pekerja_di_kebun_anggota",
        label:
          "Ya, saya memastikan adanya akses air minum dan toilet bagi pekerja di kebun anggota",
        score: 2,
      },
      {
        value: "tidak_memastikan_adanya_akses_air_minum_dan_toilet_bagi_pekerja_di_kebun_anggota",
        label:
          "Tidak, saya tidak memastikan adanya akses air minum dan toilet bagi pekerja di kebun anggota",
        score: 0,
      },
      {
        value: "sedang_proses_memastikan_adanya_akses_air_minum_dan_toilet_bagi_pekerja_di_kebun_anggota",
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
        value: "ya_pekerja_di_kebun_saya_merasa_aman",
        label: "Ya, pekerja dikebun saya merasa aman",
        score: 2,
      },
      {
        value: "tidak_pekerja_di_kebun_saya_merasa_aman",
        label: "Tidak, pekerja dikebun saya tidak merasa aman",
        score: 0,
      },
      {
        value: "sedang_proses_membuat_tempat_kerja_yang_aman_agar_pekerja_di_kebun_saya_merasa_aman",
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
        value: "ya_kelompok_secara_berkala_memeriksa_atau_mendapatkan_umpan_balik_dari_pekerja",
        label:
          "Ya, kelompok secara berkala memeriksa atau mendapatkan umpan balik dari pekerja (melalui kunjungan atau laporan) bahwa mereka bekerja di lingkungan yang aman dan bebas dari diskriminasi, pelecehan, atau kekerasan",
        score: 2,
      },
      {
        value: "tidak_kelompok_secara_berkala_memeriksa_atau_mendapatkan_umpan_balik_dari_pekerja",
        label:
          "Tidak, kelompok tidak secara berkala memeriksa atau mendapatkan umpan balik dari pekerja (melalui kunjungan atau laporan) bahwa mereka bekerja di lingkungan yang aman dan bebas dari diskriminasi, pelecehan, atau kekerasan",
        score: 0,
      },
      {
        value: "sedang_proses_memastikan_kelompok_secara_berkala_memeriksa_atau_mendapatkan_umpan_balik_dari_pekerja",
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
        value: "ya_sudah_menerapkan_praktik_khusus_untuk_menjaga_dan_melindungi_kawasan_penting",
        label:
          "Ya, saya sudah menerapkan praktik khusus untuk menjaga dan melindungi kawasan penting",
        score: 2,
      },
      {
        value: "tidak_sudah_menerapkan_praktik_khusus_untuk_menjaga_dan_melindungi_kawasan_penting",
        label:
          "Tidak, saya belum menerapkan praktik khusus untuk menjaga dan melindungi kawasan penting",
        score: 0,
      },
      {
        value: "sedang_proses_menerapkan_praktik_khusus_untuk_menjaga_dan_melindungi_kawasan_penting",
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
        value: "ya_sudah_mengetahui_ada_kawasan_penting_di_area_sekitar_kebun_saya",
        label:
          "Ya, saya sudah mengetahui ada kawasan penting di area sekitar kebun saya",
        score: 2,
      },
      {
        value: "tidak_sudah_mengetahui_ada_kawasan_penting_di_area_sekitar_kebun_saya",
        label:
          "Tidak, saya belum mengetahui ada kawasan penting di area sekitar kebun saya",
        score: 0,
      },
      {
        value: "sedang_proses_mengetahui_adanya_kawasan_penting_di_area_sekitar_kebun_saya",
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
        value: "ya_melakukan_tindakan_untuk_mencegah_kerusakan_atau_gangguan_terhadap_kawasan_atau_satwa",
        label:
          "Ya, saya melakukan tindakan untuk mencegah kerusakan atau gangguan terhadap kawasan atau satwa",
        score: 2,
      },
      {
        value: "tidak_melakukan_tindakan_untuk_mencegah_kerusakan_atau_gangguan_terhadap_kawasan_atau_satwa",
        label:
          "Tidak, saya tidak melakukan tindakan untuk mencegah kerusakan atau gangguan terhadap kawasan atau satwa",
        score: 0,
      },
      {
        value: "sedang_proses_melakukan_tindakan_untuk_mencegah_kerusakan_atau_gangguan_terhadap_kawasan_atau_satwa",
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
        value: "ya_secara_rutin_menjaga_agar_kawasan_tersebut_tetap_terlindungi_dan_tidak_diganggu_oleh_kegiatan_kebun",
        label:
          "Ya, saya secara rutin menjaga agar kawasan tersebut tetap terlindungi dan tidak diganggu oleh kegiatan kebun",
        score: 2,
      },
      {
        value: "tidak_secara_rutin_menjaga_agar_kawasan_tersebut_tetap_terlindungi_dan_tidak_diganggu_oleh_kegiatan_kebun",
        label:
          "Tidak, saya secara rutin tidak menjaga agar kawasan tersebut tetap terlindungi dan tidak diganggu oleh kegiatan kebun",
        score: 0,
      },
      {
        value: "sedang_proses_secara_rutin_menjaga_agar_kawasan_tersebut_tetap_terlindungi_dan_tidak_diganggu_oleh_kegiatan_kebun",
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
        value: "ya_kelompok_melakukan_pemantauan_terhadap_kebun_anggotanya_untuk_memastikan_perlindungan_terhadap_area_hcv_hcs",
        label:
          "Ya, kelompok melakukan pemantauan terhadap kebun anggotanya untuk memastikan perlindungan terhadap area HCV, HCS, atau keberadaan spesies langka dan terancam punah",
        score: 2,
      },
      {
        value: "tidak_kelompok_melakukan_pemantauan_terhadap_kebun_anggotanya_untuk_memastikan_perlindungan_terhadap_area_hcv_hcs",
        label:
          "Tidak, kelompok tidak melakukan pemantauan terhadap kebun anggotanya untuk memastikan perlindungan terhadap area HCV, HCS, atau keberadaan spesies langka dan terancam punah",
        score: 0,
      },
      {
        value: "sedang_proses_melakukan_pemantauan_terhadap_kebun_anggotanya_untuk_memastikan_perlindungan_terhadap_area_hcv_hcs",
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
        value: "ya_kelompok_telah_memetakan_atau_mengidentifikasi_area_hcv_hcs_atau_habitat_satwa_langka",
        label:
          "Ya, kelompok telah memetakan atau mengidentifikasi area HCV, HCS, atau habitat satwa langka di dalam wilayah sertifikasi kelompok",
        score: 2,
      },
      {
        value: "tidak_kelompok_telah_memetakan_atau_mengidentifikasi_area_hcv_hcs_atau_habitat_satwa_langka",
        label:
          "Tidak, kelompok belum memetakan atau mengidentifikasi area HCV, HCS, atau habitat satwa langka di dalam wilayah sertifikasi kelompok",
        score: 0,
      },
      {
        value: "sedang_proses_memetakan_atau_mengidentifikasi_area_hcv_hcs_atau_habitat_satwa_langka",
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
        value: "ya_kelompok_memantau_dan_memberi_pendampingan_kepada_anggota_untuk_melindungi_kawasan_atau_spesies_yang_penting",
        label:
          "Ya, kelompok memantau dan memberi pendampingan kepada anggota untuk melindungi kawasan atau spesies yang penting",
        score: 2,
      },
      {
        value: "tidak_kelompok_memantau_dan_memberi_pendampingan_kepada_anggota_untuk_melindungi_kawasan_atau_spesies_yang_penting",
        label:
          "Tidak, kelompok tidak memantau dan memberi pendampingan kepada anggota untuk melindungi kawasan atau spesies yang penting",
        score: 0,
      },
      {
        value: "sedang_proses_memantau_dan_memberi_pendampingan_kepada_anggota_untuk_melindungi_kawasan_atau_spesies_yang_penting",
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
        value: "ya_kelompok_memiliki_rencana_remediasi_yang_sudah_disetujui_rspo",
        label:
          "Ya, kelompok memiliki rencana remediasi yang sudah disetujui RSPO",
        score: 2,
      },
      {
        value: "tidak_kelompok_memiliki_rencana_remediasi_yang_sudah_disetujui_rspo",
        label:
          "Tidak, kelompok tidak memiliki rencana remediasi yang sudah disetujui RSPO",
        score: 0,
      },
      {
        value: "sedang_proses_membuat_rencana_remediasi_yang_akan_disetujui_rspo",
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
        value: "ya_rencana_remediasi_tersebut_sedang_dijalankan_oleh_kelompok",
        label: "Ya, rencana remediasi tersebut sedang dijalankan oleh kelompok",
        score: 2,
      },
      {
        value: "tidak_rencana_remediasi_tersebut_sedang_dijalankan_oleh_kelompok",
        label:
          "Tidak, rencana remediasi tersebut belum dijalankan oleh kelompok",
        score: 0,
      },
      {
        value: "sedang_proses_rencana_remediasi_tersebut_akan_dijalankan_oleh_kelompok",
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
        value: "ya_sudah_menyusun_rencana_bersama_untuk_membuka_kebun_sawit_baru",
        label:
          "Ya, sudah menyusun rencana bersama untuk membuka kebun sawit baru",
        score: 2,
      },
      {
        value: "tidak_sudah_menyusun_rencana_bersama_untuk_membuka_kebun_sawit_baru",
        label:
          "Tidak, belum menyusun rencana bersama untuk membuka kebun sawit baru",
        score: 0,
      },
      {
        value: "sedang_proses_menyusun_rencana_bersama_untuk_membuka_kebun_sawit_baru",
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
        value: "ya_mengetahui_rencana_tersebut_sudah_dibagikan_kepada_pihak_pihak_yang_ikut_dalam_pemetaan_bersama",
        label:
          "Ya, saya mengetahui bahwa rencana tersebut sudah dibagikan kepada pihak-pihak yang ikut dalam pemetaan bersama",
        score: 2,
      },
      {
        value: "tidak_mengetahui_rencana_tersebut_sudah_dibagikan_kepada_pihak_pihak_yang_ikut_dalam_pemetaan_bersama",
        label:
          "Tidak, saya tidak mengetahui bahwa rencana tersebut sudah dibagikan kepada pihak-pihak yang ikut dalam pemetaan bersama",
        score: 0,
      },
      {
        value: "sedang_proses_mencari_tahu_rencana_tersebut_sudah_dibagikan_kepada_pihak_pihak_yang_ikut_dalam_pemetaan_bersama",
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
        value: "ya_sudah_mengetahui_rencana_tersebut_sudah_disetujui_oleh_rspo",
        label:
          "Ya, sudah mengetahui bahwa rencana tersebut sudah disetuji oleh RSPO",
        score: 2,
      },
      {
        value: "tidak_sudah_mengetahui_rencana_tersebut_sudah_disetujui_oleh_rspo",
        label:
          "Tidak, belum mengetahui bahwa rencana tersebut sudah disetuji oleh RSPO",
        score: 0,
      },
      {
        value: "sedang_proses_mencari_tahu_rencana_tersebut_sudah_disetujui_oleh_rspo",
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
        value: "ya_kelompok_telah_memiliki_dokumen_rencana_pengelolaan_penanaman_baru_yang_sudah_disetujui_oleh_rspo",
        label:
          "Ya, kelompok telah memiliki dokumen rencana pengelolaan penanaman baru yang sudah disetujui oleh RSPO",
        score: 2,
      },
      {
        value: "tidak_kelompok_telah_memiliki_dokumen_rencana_pengelolaan_penanaman_baru_yang_sudah_disetujui_oleh_rspo",
        label:
          "Tidak, kelompok belum memiliki dokumen rencana pengelolaan penanaman baru yang sudah disetujui oleh RSPO",
        score: 0,
      },
      {
        value: "sedang_proses_membuat_dokumen_rencana_pengelolaan_penanaman_baru_yang_akan_disetujui_oleh_rspo",
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
        value: "ya_kelompok_sudah_menyampaikan_rencana_ini_kepada_semua_pihak_yang_terlibat_dalam_proses_pemetaan_partisipatif_sebelum_lahan_dibuka",
        label:
          "Ya, kelompok sudah menyampaikan rencana ini kepada semua pihak yang terlibat dalam proses pemetaan partisipatif sebelum lahan dibuka",
        score: 2,
      },
      {
        value: "tidak_kelompok_sudah_menyampaikan_rencana_ini_kepada_semua_pihak_yang_terlibat_dalam_proses_pemetaan_partisipatif_sebelum_lahan_dibuka",
        label:
          "Tidak, kelompok belum menyampaikan rencana ini kepada semua pihak yang terlibat dalam proses pemetaan partisipatif sebelum lahan dibuka",
        score: 0,
      },
      {
        value: "sedang_proses_menyampaikan_rencana_ini_kepada_semua_pihak_yang_terlibat_dalam_proses_pemetaan_partisipatif_sebelum_lahan_dibuka",
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
        value: "ya_saya_menjalankan_panduan_kelompok_terkait_cara_mencegah_kebakaran_dan_mengelola_air_di_kebun_sawit",
        label:
          "Ya, saya menjalankan panduan kelompok terkait cara mencegah kebakaran dan mengelola air di kebun sawit",
        score: 2,
      },
      {
        value: "tidak_saya_menjalankan_panduan_kelompok_terkait_cara_mencegah_kebakaran_dan_mengelola_air_di_kebun_sawit",
        label:
          "Tidak, saya belum menjalankan panduan kelompok terkait cara mencegah kebakaran dan mengelola air di kebun sawit",
        score: 0,
      },
      {
        value: "sedang_proses_menjalankan_panduan_kelompok_terkait_cara_mencegah_kebakaran_dan_mengelola_air_di_kebun_sawit",
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
        value: "ya_saya_mengetahui_dan_melakukan_pemantauan_terhadap_penurunan_permukaan_tanah",
        label:
          "Ya, saya mengetahui dan melakukan pemantauan terhadap penurunan permukaan tanah",
        score: 2,
      },
      {
        value: "tidak_saya_mengetahui_dan_melakukan_pemantauan_terhadap_penurunan_permukaan_tanah",
        label:
          "Tidak, saya tidak mengetahui dan tidak melakukan pemantauan terhadap penurunan permukaan tanah",
        score: 0,
      },
      {
        value: "sedang_proses_memahami_dan_mencoba_melakukan_pemantauan_terhadap_penurunan_permukaan_tanah",
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
        value: "ya_kelompok_memiliki_rencana_aksi_tertulis_untuk_mengelola_api_air_dan_lahan_gambut_yang_telah_ditanami",
        label:
          "Ya, kelompok memiliki rencana aksi tertulis untuk mengelola api, air, dan lahan gambut yang telah ditanami",
        score: 2,
      },
      {
        value: "tidak_kelompok_memiliki_rencana_aksi_tertulis_untuk_mengelola_api_air_dan_lahan_gambut_yang_telah_ditanami",
        label:
          "Tidak, kelompok tidak memiliki rencana aksi tertulis untuk mengelola api, air, dan lahan gambut yang telah ditanami",
        score: 0,
      },
      {
        value: "sedang_proses_memahami_untuk_membuat_rencana_aksi_tertulis_untuk_mengelola_api_air_dan_lahan_gambut_yang_telah_ditanami",
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
        value: "ya_kelompok_memantau_dan_mencatat_penurunan_permukaan_tanah_di_lahan_gambut",
        label:
          "Ya, kelompok memantau dan mencatat penurunan permukaan tanah di lahan gambut",
        score: 2,
      },
      {
        value: "tidak_kelompok_memantau_dan_mencatat_penurunan_permukaan_tanah_di_lahan_gambut",
        label:
          "Tidak, kelompok tidak memantau dan mencatat penurunan permukaan tanah di lahan gambut",
        score: 0,
      },
      {
        value: "sedang_proses_memantau_dan_mencatat_penurunan_permukaan_tanah_di_lahan_gambut",
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
        value: "ya_mengetahui_lahan_yang_akan_ditanam_ulang_termasuk_lahan_gambut",
        label:
          "Ya, mengetahui lahan yang akan ditanam ulang termasuk lahan gambut",
        score: 2,
      },
      {
        value: "tidak_mengetahui_lahan_yang_akan_ditanam_ulang_termasuk_lahan_gambut",
        label:
          "Tidak mengetahui apakah lahan yang akan ditanam ulang termasuk lahan gambut",
        score: 0,
      },
      {
        value: "sedang_proses_mengetahui_lahan_yang_akan_ditanam_ulang_termasuk_lahan_gambut",
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
        value: "ya_saya_pernah_mengalami_banjir_atau_masuknya_air_asin_di_kebun",
        label:
          "Ya, saya pernah mengalami banjir atau masuknya air asin di kebun",
        score: 2,
      },
      {
        value: "tidak_saya_pernah_mengalami_banjir_atau_masuknya_air_asin_di_kebun",
        label:
          "Tidak, saya tidak pernah mengalami banjir atau masuknya air asin di kebun ",
        score: 0,
      },
      {
        value: "sedang_proses_mengetahui_mengalami_banjir_atau_masuknya_air_asin_di_kebun",
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
            value: "ya_sudah_ada_rencana_lain_untuk_mengelola_lahan",
            label: "Ya, sudah ada rencana lain untuk mengelola lahan",
            score: 2,
          },
          {
            value: "tidak_ada_rencana_lain_untuk_mengelola_lahan",
            label: "Tidak ada rencana lain untuk mengelola lahan",
            score: 0,
          },
          {
            value: "sedang_proses_membuat_rencana_lain_untuk_mengelola_lahan",
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
        value: "ya_kelompok_membantu_petani_menilai_risiko_banjir_atau_air_asin_sebelum_menanam_ulang_di_lahan_gambut",
        label:
          "Ya, kelompok membantu petani menilai risiko banjir atau air asin sebelum menanam ulang di lahan gambut",
        score: 2,
      },
      {
        value: "tidak_kelompok_membantu_petani_menilai_risiko_banjir_atau_air_asin_sebelum_menanam_ulang_di_lahan_gambut",
        label:
          "Tidak, kelompok tidak membantu petani menilai risiko banjir atau air asin sebelum menanam ulang di lahan gambut",
        score: 0,
      },
      {
        value: "sedang_proses_merencanakan_untuk_membantu_petani_menilai_risiko_banjir_atau_air_asin_sebelum_menanam_ulang_di_lahan_gambut",
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
        value: "ya_kelompok_pernah_menyusun_rencana_bersama_petani_untuk_mencari_cara_lain_mengelola_lahan_gambut_yang_berisiko_tinggi",
        label:
          "Ya, kelompok pernah menyusun rencana bersama petani untuk mencari cara lain mengelola lahan gambut yang berisiko tinggi",
        score: 2,
      },
      {
        value: "tidak_kelompok_pernah_menyusun_rencana_bersama_petani_untuk_mencari_cara_lain_mengelola_lahan_gambut_yang_berisiko_tinggi",
        label:
          "Tidak, kelompok tidak pernah menyusun rencana bersama petani untuk mencari cara lain mengelola lahan gambut yang berisiko tinggi",
        score: 0,
      },
      {
        value: "sedang_proses_menyusun_rencana_bersama_petani_untuk_mencari_cara_lain_mengelola_lahan_gambut_yang_berisiko_tinggi",
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
        value: "ya_saya_pernah_menggunakan_api_untuk_membersihkan_lahan_membakar_limbah_atau_mengendalikan_hama",
        label:
          "Ya, saya pernah menggunakan api untuk membersihkan lahan, membakar limbah, atau mengendalikan hama",
        score: 2,
      },
      {
        value: "tidak_saya_pernah_menggunakan_api_untuk_membersihkan_lahan_membakar_limbah_atau_mengendalikan_hama",
        label:
          "Tidak, saya tidak pernah menggunakan api untuk membersihkan lahan, membakar limbah, atau mengendalikan hama ",
        score: 0,
      },
      {
        value: "sedang_proses_mengetahui_cara_menggunakan_api_untuk_membersihkan_lahan_membakar_limbah_atau_mengendalikan_hama",
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
            value: "ya_dilakukan_karena_tidak_ada_cara_lain_dan_sudah_mendapatkan_izin_dari_pihak_berwenang",
            label:
              "Ya, dilakukan karena tidak ada cara lain dan sudah mendapatkan izin dari pihak berwenang",
            score: 2,
          },
          {
            value: "tidak_dilakukan_karena_ada_cara_lain_dan_belum_mendapatkan_izin_dari_pihak_berwenang",
            label:
              "Tidak, dilakukan karena ada cara lain dan belum mendapatkan izin dari pihak berwenang",
            score: 0,
          },
          {
            value: "sedang_proses_mendapatkan_izin_dari_pihak_berwenang",
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
        value: "ya_kelompok_memiliki_aturan_atau_panduan_untuk_memastikan_anggota_tidak_membakar_lahan_atau_limbah",
        label:
          "Ya, kelompok memiliki aturan atau panduan untuk memastikan anggota tidak membakar lahan atau limbah",
        score: 2,
      },
      {
        value: "tidak_kelompok_memiliki_aturan_atau_panduan_untuk_memastikan_anggota_tidak_membakar_lahan_atau_limbah",
        label:
          "Tidak, kelompok tidak memiliki aturan atau panduan untuk memastikan anggota tidak membakar lahan atau limbah",
        score: 0,
      },
      {
        value: "sedang_proses_menyusun_rencana_memiliki_aturan_atau_panduan_untuk_memastikan_anggota_tidak_membakar_lahan_atau_limbah",
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
        value: "ya_kelompok_memantau_dan_mencatat_jika_ada_anggota_yang_menggunakan_api_dalam_situasi_tertentu",
        label:
          "Ya, kelompok memantau dan mencatat jika ada anggota yang menggunakan api dalam situasi tertentu",
        score: 2,
      },
      {
        value: "tidak_kelompok_memantau_dan_mencatat_jika_ada_anggota_yang_menggunakan_api_dalam_situasi_tertentu",
        label:
          "Tidak, kelompok tidak memantau dan mencatat jika ada anggota yang menggunakan api dalam situasi tertentu",
        score: 0,
      },
      {
        value: "sedang_proses_memantau_dan_mencatat_jika_ada_anggota_yang_menggunakan_api_dalam_situasi_tertentu",
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
        value: "ya_saya_menyimpan_pestisida_atau_bahan_kimia_lain_di_tempat_khusus_yang_aman_dan_jauh_dari_anak_anak",
        label:
          "Ya, saya menyimpan pestisida atau bahan kimia lain di tempat khusus yang aman dan jauh dari anak-anak",
        score: 2,
      },
      {
        value: "tidak_saya_menyimpan_pestisida_atau_bahan_kimia_lain_di_tempat_khusus_yang_aman_dan_jauh_dari_anak_anak",
        label:
          "Tidak, saya tidak menyimpan pestisida atau bahan kimia lain di tempat khusus yang aman dan jauh dari anak-anak",
        score: 0,
      },
      {
        value: "sedang_proses_menyimpan_pestisida_atau_bahan_kimia_lain_di_tempat_khusus_yang_aman_dan_jauh_dari_anak_anak",
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
        value: "ya_saya_mencampur_dan_menggunakan_pestisida_sesuai_aturan",
        label: "Ya, saya mencampur dan menggunakan pestisida sesuai aturan",
        score: 2,
      },
      {
        value: "tidak_saya_mencampur_dan_menggunakan_pestisida_sesuai_aturan",
        label:
          "Tidak, saya tidak mencampur dan menggunakan pestisida sesuai aturan",
        score: 0,
      },
      {
        value: "sedang_proses_cara_mencampur_dan_menggunakan_pestisida_sesuai_aturan",
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
        value: "ya_saya_membuang_botol_atau_wadah_bekas_pestisida_di_tempat_yang_aman_dan_tidak_dibakar_atau_dibuang_sembarangan",
        label:
          "Ya, saya membuang botol atau wadah bekas pestisida di tempat yang aman dan tidak dibakar atau dibuang sembarangan",
        score: 2,
      },
      {
        value: "tidak_saya_membuang_botol_atau_wadah_bekas_pestisida_di_tempat_yang_aman_dan_tidak_dibakar_atau_dibuang_sembarangan",
        label:
          "Tidak, saya tidak membuang botol atau wadah bekas pestisida di tempat yang aman dan tidak dibakar atau dibuang sembarangan",
        score: 0,
      },
      {
        value: "sedang_proses_cara_membuang_botol_atau_wadah_bekas_pestisida_di_tempat_yang_aman_dan_tidak_dibakar_atau_dibuang_sembarangan",
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
        value: "ya_kelompok_memberikan_pelatihan_atau_panduan_kepada_petani_tentang_cara_menyimpan_menggunakan_dan_membuang_bahan_kimia_pertanian_dengan_aman",
        label:
          "Ya, kelompok memberikan pelatihan atau panduan kepada petani tentang cara menyimpan, menggunakan, dan membuang bahan kimia pertanian dengan aman",
        score: 2,
      },
      {
        value: "tidak_kelompok_memberikan_pelatihan_atau_panduan_kepada_petani_tentang_cara_menyimpan_menggunakan_dan_membuang_bahan_kimia_pertanian_dengan_aman",
        label:
          "Tidak, kelompok tidak memberikan pelatihan atau panduan kepada petani tentang cara menyimpan, menggunakan, dan membuang bahan kimia pertanian dengan aman",
        score: 0,
      },
      {
        value: "sedang_proses_memberikan_pelatihan_atau_panduan_kepada_petani_tentang_cara_menyimpan_menggunakan_dan_membuang_bahan_kimia_pertanian_dengan_aman",
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
        value: "ya_kelompok_secara_berkala_memantau_bagaimana_petani_menangani_dan_menyimpan_bahan_kimia_tersebut_di_kebunnya",
        label:
          "Ya, kelompok secara berkala memantau bagaimana petani menangani dan menyimpan bahan kimia tersebut di kebunnya",
        score: 2,
      },
      {
        value: "tidak_kelompok_tidak_secara_berkala_memantau_bagaimana_petani_menangani_dan_menyimpan_bahan_kimia_tersebut_di_kebunnya",
        label:
          "Tidak, kelompok tidak secara berkala memantau bagaimana petani menangani dan menyimpan bahan kimia tersebut di kebunnya",
        score: 0,
      },
      {
        value: "sedang_proses_merencanakan_agar_kelompok_secara_berkala_memantau_bagaimana_petani_menangani_dan_menyimpan_bahan_kimia_tersebut_di_kebunnya",
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
        value: "ya_saya_mengetahui_siapa_saja_yang_diperbolehkan_menggunakan_pestisida_di_kebun",
        label:
          "Ya, saya mengetahui siapa saja yang diperbolehkan menggunakan pestisida di kebun",
        score: 2,
      },
      {
        value: "tidak_saya_tidak_mengetahui_siapa_saja_yang_diperbolehkan_menggunakan_pestisida_di_kebun",
        label:
          "Tidak, saya tidak mengetahui siapa saja yang diperbolehkan menggunakan pestisida di kebun",
        score: 0,
      },
      {
        value: "sedang proses_mengetahui_siapa_saja_yang_diperbolehkan_menggunakan_pestisida_di_kebun",
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
        value: "ya_saya_menggunakan_pestisida_dengan_mengikuti_aturan_yang_aman",
        label:
          "Ya, saya menggunakan pestisida dengan mengikuti aturan yang aman",
        score: 2,
      },
      {
        value: "tidak_menggunakan_pestisida_dengan_mengikuti_aturan_yang_aman",
        label:
          "Tidak, saya tidak menggunakan pestisida dengan mengikuti aturan yang aman",
        score: 0,
      },
      {
        value: "sedang proses_cara_menggunakan_pestisida_dengan_mengikuti_aturan_yang_aman",
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
        value: "ya_kelompok_memberikan_panduan_atau_daftar_pestisida_yang_dilarang_digunakan",
        label:
          "Ya, kelompok memberikan panduan atau daftar pestisida yang dilarang digunakan",
        score: 2,
      },
      {
        value: "tidak_kelompok_tidak_memberikan_panduan_atau_daftar_pestisida_yang_dilarang_digunakan",
        label:
          "Tidak, kelompok tidak memberikan panduan atau daftar pestisida yang dilarang digunakan",
        score: 0,
      },
      {
        value: "sedang proses_memberikan_panduan_atau_daftar_pestisida_yang_dilarang_digunakan",
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
        value: "ya_kelompok_memastikan_bahwa_tidak_ada_ibu_hamil_menyusui_atau_pekerja_anak_yang_terlibat_dalam_penyemprotan_pestisida",
        label:
          "Ya, kelompok memastikan bahwa tidak ada ibu hamil, menyusui, atau pekerja anak yang terlibat dalam penyemprotan pestisida",
        score: 2,
      },
      {
        value: "tidak_kelompok_memastikan_bahwa_tidak_ada_ibu_hamil_menyusui_atau_pekerja_anak_yang_terlibat_dalam_penyemprotan_pestisida",
        label:
          "Tidak, kelompok tidak memastikan bahwa tidak ada ibu hamil, menyusui, atau pekerja anak yang terlibat dalam penyemprotan pestisida",
        score: 0,
      },
      {
        value: "sedang proses_memastikan_bahwa_tidak_ada_ibu_hamil_menyusui_atau_pekerja_anak_yang_terlibat_dalam_penyemprotan_pestisida",
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
        value: "ya_saya_pernah_mencoba_cara_lain_selain_menggunakan_pestisida_atau_herbisida_untuk_mengendalikan_hama_dan_gulma_di_kebun",
        label:
          "Ya, saya pernah mencoba cara lain selain menggunakan pestisida atau herbisida untuk mengendalikan hama dan gulma di kebun",
        score: 2,
      },
      {
        value: "tidak_saya_tidak_pernah_mencoba_cara_lain_selain_menggunakan_pestisida_atau_herbisida_untuk_mengendalikan_hama_dan_gulma_di_kebun",
        label:
          "Tidak, saya tidak pernah mencoba cara lain selain menggunakan pestisida atau herbisida untuk mengendalikan hama dan gulma di kebun",
        score: 0,
      },
      {
        value: "sedang proses_mencobalah_cara_lain_selain_menggunakan_pestisida_atau_herbisida_untuk_mengendalikan_hama_dan_gulma_di_kebun",
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
        value: "ya_saya_melakukan_pengendalian_hama_dengan_cara_yang_ramah_lingkungan",
        label:
          "Ya, saya melakukan pengendalian hama dengan cara yang ramah lingkungan",
        score: 2,
      },
      {
        value: "tidak_saya_melakukan_pengendalian_hama_dengan_cara_yang_ramah_lingkungan",
        label:
          "Tidak, saya tidak melakukan pengendalian hama dengan cara yang ramah lingkungan",
        score: 0,
      },
      {
        value: "sedang proses_melakukan_pengendalian_hama_dengan_cara_yang_ramah_lingkungan",
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
        value: "ya_kelompok_mendorong_dan_memberikan_pelatihan_kepada_petani_untuk_mengurangi_penggunaan_pestisida_dan_herbisida_di_kebun",
        label:
          "Ya, kelompok mendorong dan memberikan pelatihan kepada petani untuk mengurangi penggunaan pestisida dan herbisida di kebun",
        score: 2,
      },
      {
        value: "tidak_kelompok_tidak_mendorong_dan_tidak_memberikan_pelatihan_kepada_petani_untuk_mengurangi_penggunaan_pestisida_dan_herbisida_di_kebun",
        label:
          "Tidak, kelompok tidak mendorong dan tidak memberikan pelatihan kepada petani untuk mengurangi penggunaan pestisida dan herbisida di kebun",
        score: 0,
      },
      {
        value: "sedang proses_mendorong_dan_memberikan_pelatihan_kepada_petani_untuk_mengurangi_penggunaan_pestisida_dan_herbisida_di_kebun",
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
        value: "ya_kelompok_mencatat_atau_memantau_penerapan_cara-cara_PHT_oleh_petani_di_kebun",
        label:
          "Ya, kelompok mencatat atau memantau penerapan cara-cara Pengendalian Hama Terpadu (PHT) oleh petani di kebun",
        score: 2,
      },
      {
        value: "tidak_kelompok_tidak_mencatat_atau_memantau_penerapan_cara-cara_PHT_oleh_petani_di_kebun",
        label:
          "Tidak, kelompok tidak mencatat atau memantau penerapan cara-cara Pengendalian Hama Terpadu (PHT) oleh petani di kebun",
        score: 0,
      },
      {
        value: "sedang proses_mencatat_atau_memantau_penerapan_cara-cara_PHT_oleh_petani_di_kebun",
        label:
          "Sedang proses mencatat atau memantau penerapan cara-cara Pengendalian Hama Terpadu (PHT) oleh petani di kebun",
        score: 1,
      },
    ],
    roleSpecific: "manajer",
  },
];
