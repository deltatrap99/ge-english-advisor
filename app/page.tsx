"use client";

import { useEffect, useMemo, useState } from "react";

type Tone = "green" | "blue" | "pink";
type View =
  | "home"
  | "pathway"
  | "advisor"
  | "products"
  | "scripts"
  | "exams";
type JourneyLevel = {
  id: string;
  label: string;
  sub: string;
  profile: string;
  canDo: string;
  counsel: string;
};
type AdvisorAnswers = Record<string, string>;
type AdvisorQuestion = {
  key: string;
  title: string;
  note: string;
  options: string[][];
  showWhen?: (answers: AdvisorAnswers) => boolean;
};
type AdvisorRecommendation = {
  product: string;
  verdict: string;
  tone: Tone | "neutral";
  confidence: "Cao" | "Trung bình" | "Thấp";
  summary: string;
  eligibility: string[];
  rationale: string[];
  fitAnalysis: {
    angle: string;
    status: "Phù hợp" | "Cần xác minh" | "Cần điều chỉnh";
    explanation: string;
  }[];
  missing: string[];
  actions: string[];
};

const yleLevels: JourneyLevel[] = [
  {
    id: "beginners",
    label: "Beginners",
    sub: "Tiền Pre A1",
    profile:
      "Học sinh mới làm quen tiếng Anh, vốn từ còn rời rạc, cần hình thành thói quen nghe và phản xạ với chỉ dẫn đơn giản.",
    canDo:
      "Nhận biết âm, từ và mẫu câu quen thuộc; giới thiệu thông tin rất cơ bản với hỗ trợ trực quan.",
    counsel:
      "Ưu tiên hứng thú, phát âm và sự tự tin. Chưa đặt áp lực bài thi hoặc ghi nhớ ngữ pháp tách rời ngữ cảnh.",
  },
  {
    id: "starters",
    label: "Pre A1 Starters",
    sub: "Nền tảng ban đầu",
    profile:
      "Đã có vốn từ cơ bản về bản thân, gia đình, trường học và đồ vật quen thuộc; vẫn cần hình ảnh hoặc gợi ý.",
    canDo:
      "Hiểu câu hỏi ngắn, đọc và viết từ/câu rất đơn giản, trả lời về thông tin cá nhân trong tình huống quen thuộc.",
    counsel:
      "Giúp con kết nối từ vựng với nghe - nói - đọc - viết, thay vì chỉ học danh sách từ hoặc luyện dạng đề.",
  },
  {
    id: "movers",
    label: "A1 Movers",
    sub: "Giao tiếp đơn giản",
    profile:
      "Có thể xử lý các tình huống quen thuộc nhưng câu nói còn ngắn, độ chính xác và khả năng duy trì hội thoại chưa ổn định.",
    canDo:
      "Hiểu hướng dẫn trực tiếp, mô tả người/vật/sự việc, viết câu ngắn và tham gia trao đổi đơn giản về đời sống hằng ngày.",
    counsel:
      "Tăng độ dài phát ngôn, khả năng kể - mô tả và chuyển kiến thức sang sử dụng chủ động; không chỉ nâng độ khó bài tập.",
  },
  {
    id: "flyers",
    label: "A2 Flyers",
    sub: "Sử dụng độc lập hơn",
    profile:
      "Đã có nền tảng để giao tiếp trong nhiều tình huống quen thuộc; bắt đầu cần diễn đạt ý kiến và xử lý văn bản dài hơn.",
    canDo:
      "Theo dõi hội thoại ngắn, đọc hiểu văn bản đơn giản, kể lại sự việc và viết đoạn có liên kết ở mức cơ bản.",
    counsel:
      "Sau Flyers cần nhìn mục tiêu tiếp theo: tiếng Anh tổng quát cho Teens hay IELTS. Không tự động chuyển thẳng sang luyện thi.",
  },
];

const generalLevels: JourneyLevel[] = [
  {
    id: "a1",
    label: "A1",
    sub: "Basic user",
    profile:
      "Hiểu và sử dụng các biểu đạt quen thuộc; giao tiếp được khi người đối thoại nói chậm, rõ và có hỗ trợ.",
    canDo:
      "Giới thiệu bản thân, hỏi - đáp thông tin cá nhân, xử lý nhu cầu rất cơ bản trong bối cảnh quen thuộc.",
    counsel:
      "Củng cố hệ thống ngôn ngữ và tính chủ động; chưa nên vội chuyển sang kỹ thuật làm bài học thuật.",
  },
  {
    id: "a2",
    label: "A2",
    sub: "Elementary user",
    profile:
      "Có thể giao tiếp trong các nhiệm vụ thường ngày nhưng còn hạn chế khi chủ đề mới, tốc độ nói nhanh hoặc cần lập luận.",
    canDo:
      "Mô tả nền tảng cá nhân, môi trường xung quanh và trao đổi thông tin trực tiếp trong tình huống quen thuộc.",
    counsel:
      "Mở rộng vốn từ theo chủ đề, tăng độ trôi chảy và chuyển sang văn bản/hội thoại có kết nối.",
  },
  {
    id: "b1",
    label: "B1",
    sub: "Independent user",
    profile:
      "Đã tương đối độc lập trong bối cảnh quen thuộc; có thể diễn đạt trải nghiệm và ý kiến nhưng chiều sâu, độ chính xác còn giới hạn.",
    canDo:
      "Nắm ý chính của đầu vào chuẩn, xử lý tình huống học tập/du lịch, viết văn bản có liên kết và giải thích ngắn gọn.",
    counsel:
      "Phát triển lập luận, độ chính xác và chiến lược tự học. Có thể bắt đầu chuẩn bị học thuật nếu mục tiêu rõ.",
  },
  {
    id: "b2",
    label: "B2",
    sub: "Upper-intermediate",
    profile:
      "Có thể tương tác tương đối tự nhiên và tiếp cận nội dung phức tạp; cần tinh chỉnh ngôn ngữ học thuật và hiệu suất làm bài.",
    canDo:
      "Hiểu ý chính của văn bản phức tạp, trao đổi khá trôi chảy và trình bày quan điểm có lý do, ưu - nhược điểm.",
    counsel:
      "Nếu cần IELTS, chuyển trọng tâm sang tiêu chí chấm, chiến lược kỹ năng và luyện tập có phản hồi.",
  },
];

const ieltsLevels: JourneyLevel[] = [
  {
    id: "ielts2",
    label: "2.0-2.5",
    sub: "Introduction",
    profile:
      "Nền tảng ngôn ngữ còn rất hạn chế; chưa thể xử lý ổn định các nhiệm vụ IELTS nếu chỉ luyện đề.",
    canDo:
      "Bắt đầu xây ngôn ngữ cốt lõi và làm quen tư duy bằng tiếng Anh qua nhiệm vụ thực tiễn.",
    counsel:
      "Ưu tiên xây nền, thói quen học và bốn kỹ năng; đặt mốc gần 3.0-3.5 trước khi tăng độ khó.",
  },
  {
    id: "ielts3",
    label: "3.0-3.5",
    sub: "Foundation",
    profile:
      "Hiểu được ý rất cơ bản nhưng vốn từ, ngữ pháp và khả năng xử lý đầu vào dài còn thiếu ổn định.",
    canDo:
      "Thực hiện nhiệm vụ ngôn ngữ có cấu trúc và bắt đầu hình thành nền tảng học thuật mềm.",
    counsel:
      "Không biến khóa học thành luyện mẹo. Cần phát triển ngôn ngữ và kỹ năng song song để hướng tới 4.0-4.5.",
  },
  {
    id: "ielts4",
    label: "4.0-4.5",
    sub: "Preparation",
    profile:
      "Có khả năng giao tiếp cơ bản nhưng thường gặp khó khi lập luận, xử lý văn bản học thuật và duy trì độ chính xác.",
    canDo:
      "Bắt đầu áp dụng chiến lược từng kỹ năng, nhận diện dạng bài và xử lý yêu cầu ở mức có hướng dẫn.",
    counsel:
      "Phát triển kỹ năng học thuật cốt lõi, chiến lược xử lý đề và khả năng tự đánh giá để hướng tới 5.0-5.5.",
  },
  {
    id: "ielts5",
    label: "5.0-5.5",
    sub: "Intensive",
    profile:
      "Có thể hoàn thành phần lớn nhiệm vụ nhưng chất lượng chưa đồng đều giữa kỹ năng; lỗi ngôn ngữ vẫn ảnh hưởng thông điệp.",
    canDo:
      "Vận dụng chiến lược tương đối độc lập, phát triển lập luận và xử lý dạng bài trong điều kiện thời gian.",
    counsel:
      "Cần chẩn đoán điểm nghẽn từng kỹ năng, phản hồi theo tiêu chí chấm và luyện có chủ đích để đạt 6.0-6.5.",
  },
  {
    id: "ielts6",
    label: "6.0-6.5",
    sub: "Master",
    profile:
      "Sử dụng tiếng Anh khá hiệu quả nhưng vẫn có lỗi và thiếu linh hoạt ở chủ đề phức tạp hoặc yêu cầu học thuật cao.",
    canDo:
      "Tổ chức ý rõ, xử lý đa số nhiệm vụ học thuật và giao tiếp tương đối trôi chảy, chính xác.",
    counsel:
      "Tối ưu độ sâu lập luận, tính linh hoạt và kiểm soát lỗi; luyện theo dữ liệu tiêu chí để hướng tới 7.0+.",
  },
  {
    id: "ielts7",
    label: "7.0+",
    sub: "Good user",
    profile:
      "Sử dụng tiếng Anh hiệu quả trong đa số bối cảnh, có khả năng xử lý ngôn ngữ phức tạp và lập luận học thuật.",
    canDo:
      "Hiểu chi tiết, diễn đạt linh hoạt và kiểm soát ngôn ngữ tốt; sai sót không có tính hệ thống.",
    counsel:
      "Mục tiêu nâng cao cần tập trung vào độ tinh tế, tính nhất quán và yêu cầu cụ thể của trường/chương trình.",
  },
];

const products = [
  {
    id: "speakwell",
    logo: "/speakwell-logo.png",
    logoAlt: "SpeakWell",
    tone: "green" as Tone,
    tag: "Cambridge Young Learners",
    name: "SpeakWell",
    intro:
      "Chương trình tiếng Anh trực tuyến toàn diện cho học sinh 7-12 tuổi, xây năng lực thực chất theo lộ trình Beginners → Starters → Movers → Flyers.",
    signals: [
      "Con đang ở tiểu học và cần xây nền tảng bốn kỹ năng.",
      "Phụ huynh quan tâm giao tiếp nhưng vẫn muốn có cột mốc Cambridge rõ ràng.",
      "Con biết từ/ngữ pháp nhưng chưa chủ động nghe - nói hoặc thiếu hứng thú học.",
    ],
    keys: [
      {
        title: "Ba mục tiêu trong một lộ trình",
        text: "Phát triển Nghe - Nói - Đọc - Viết; nuôi dưỡng hứng thú và giá trị tích cực; định hướng Cambridge YLE.",
      },
      {
        title: "Thực hành đa môi trường",
        text: "Lớp học cùng giáo viên, học liệu tương tác đa phương tiện, LMS và công cụ AI hỗ trợ luyện phát âm - phản xạ.",
      },
      {
        title: "Phương pháp 7E và Activity-based Learning",
        text: "Tổ chức việc học thành chu trình gợi nhớ, gắn kết, khám phá, giải thích, áp dụng, đánh giá và mở rộng.",
      },
      {
        title: "Lộ trình có đánh giá",
        text: "Xác định đầu vào, xây kế hoạch, theo dõi tiến bộ và kiểm tra định kỳ để khuyến nghị chặng tiếp theo.",
      },
    ],
    questions: [
      "Con hiện 7-12 tuổi và đang học lớp mấy?",
      "Chứng chỉ hoặc cấp độ Cambridge gần nhất của con là gì?",
      "Con đang yếu khả năng sử dụng nào: nghe hiểu, phản xạ nói, đọc hay viết?",
      "Gia đình ưu tiên năng lực thực tế, chứng chỉ hay cả hai?",
    ],
    avoid:
      "Không ưu tiên khi học sinh ngoài 7-12 tuổi, đã qua A2 và cần General English cho Teens hoặc đã có nền tảng cùng mục tiêu IELTS cụ thể.",
    close:
      "Đề xuất đánh giá đầu vào để chọn đúng Beginners/Starters/Movers/Flyers, sau đó thống nhất một mục tiêu năng lực có thể quan sát.",
  },
  {
    id: "easypass",
    logo: "/easy-pass-logo.png",
    logoAlt: "Easy PASS",
    tone: "blue" as Tone,
    tag: "General English · A1-B2",
    name: "Easy PASS",
    intro:
      "Chương trình tiếng Anh toàn diện cho học sinh 12-18 tuổi, phù hợp giai đoạn chuyển tiếp sang Teens và phát triển từ A1 đến B2.",
    signals: [
      "Học sinh cần củng cố đồng đều bốn kỹ năng thay vì chỉ chạy theo một chứng chỉ.",
      "Gia đình muốn hỗ trợ việc học ở trường, giao tiếp và nền tảng dài hạn.",
      "Học sinh sau Flyers chưa có mục tiêu IELTS rõ hoặc chưa sẵn sàng cho học thuật.",
    ],
    keys: [
      {
        title: "Thiết kế riêng cho tuổi Teens",
        text: "Kết hợp năng lực tiếng Anh, kiến thức xã hội, kỹ năng mềm và khả năng hội nhập trong giai đoạn nhiều thay đổi.",
      },
      {
        title: "Lộ trình CEFR A1 → B2",
        text: "Bốn chặng từ mất gốc/A1 đến B2, giúp Đại sứ tư vấn theo năng lực hiện tại thay vì chỉ theo tuổi.",
      },
      {
        title: "Học trực tiếp và tự luyện",
        text: "Lớp 1:1 45 phút hoặc lớp nhóm 1:8 90 phút, kết hợp LMS, bài luyện bổ sung và công cụ luyện nói.",
      },
      {
        title: "Đánh giá và đồng hành",
        text: "Kiểm tra định kỳ bốn kỹ năng, phản hồi cải thiện và theo dõi học tập để duy trì tiến độ.",
      },
    ],
    questions: [
      "Khó khăn hiện tại đến từ mất gốc, thiếu thực hành hay kiến thức không hệ thống?",
      "Mục tiêu 6-12 tháng là học trên trường, giao tiếp, CEFR hay chuẩn bị nền IELTS?",
      "Năng lực bốn kỹ năng có đồng đều không?",
      "Học sinh phù hợp lớp 1:1 hay có thể học hiệu quả trong nhóm?",
    ],
    avoid:
      "Không ưu tiên khi học sinh 7-12 tuổi vẫn cần hoàn thiện YLE, hoặc đã có band nền phù hợp, ngày thi và mục tiêu IELTS rõ.",
    close:
      "Xác định mức A1/A2/B1/B2, chọn điểm nghẽn chính và thống nhất tiêu chí tiến bộ thay vì chỉ nói chung là “học tốt hơn”.",
  },
  {
    id: "easyielts",
    logo: "/easy-ielts-logo.png",
    logoAlt: "Easy IELTS",
    tone: "pink" as Tone,
    tag: "IELTS · 2.0-7.0+",
    name: "Easy IELTS",
    intro:
      "Lộ trình luyện thi IELTS theo năng lực và band mục tiêu, kết hợp lớp live trên ICAN Learning Platform, tự luyện và phản hồi định kỳ.",
    signals: [
      "Học sinh có mục tiêu sử dụng IELTS cụ thể cho đại học, xét tuyển hoặc kế hoạch học tập.",
      "Có thể xác định band hiện tại, band mục tiêu và quỹ thời gian.",
      "Sẵn sàng duy trì cả giờ học cùng giáo viên lẫn thời lượng tự luyện.",
    ],
    keys: [
      {
        title: "Năm chặng cá nhân hóa",
        text: "Introduction 2.0-2.5; Foundation 3.0-3.5; Preparation 4.0-4.5; Intensive 5.0-5.5; Master 6.0-6.5.",
      },
      {
        title: "Phương pháp theo trình độ",
        text: "Task-based Learning cho nền tảng; CALLA cho chiến lược học thuật; 4MAT cho tư duy và khả năng ứng dụng ở band cao.",
      },
      {
        title: "Hệ sinh thái thực hành",
        text: "Lớp live, LMS, học liệu bám sát IELTS và công cụ AI hỗ trợ Speaking/Writing; nhấn mạnh học có phản hồi.",
      },
      {
        title: "Đánh giá dựa trên dữ liệu",
        text: "Mock/Final Test, chấm chữa theo tiêu chí và khuyến nghị cải thiện giúp lộ trình không dựa trên cảm tính.",
      },
    ],
    questions: [
      "IELTS sẽ được sử dụng cho mục tiêu nào và vào thời điểm nào?",
      "Band hiện tại được xác định bằng bài thi hoặc đánh giá nào?",
      "Kỹ năng nào đang tạo khoảng cách lớn nhất tới band mục tiêu?",
      "Học sinh có thể duy trì bao nhiêu giờ học và tự luyện mỗi tuần?",
    ],
    avoid:
      "Không ưu tiên chỉ vì IELTS phổ biến. Nếu chưa có mục tiêu sử dụng, nền tảng còn yếu hoặc chưa sẵn sàng học thuật, cần xây nền trước.",
    close:
      "Chốt ba dữ liệu trước khi chốt khóa: band hiện tại - band mục tiêu - thời hạn. Sau đó mới chọn chặng học và kế hoạch tự luyện.",
  },
];

const scripts = [
  {
    group: "Khám phá nhu cầu",
    title: "Mở đầu cuộc tư vấn",
    text: "Để em gợi ý đúng hướng cho con, chị cho em hỏi nhanh ba điểm: hiện con đang học lớp mấy và ở trình độ nào; kỹ năng nào con đang tự tin hoặc còn gặp khó; gia đình muốn ưu tiên giao tiếp, học trên trường hay một chứng chỉ cụ thể ạ? Em muốn hiểu đúng nhu cầu trước khi nói về khóa học.",
  },
  {
    group: "Khám phá nhu cầu",
    title: "Khi phụ huynh chỉ hỏi học phí",
    text: "Em gửi chị thông tin học phí ngay ạ. Tuy nhiên, cùng một độ tuổi có thể phù hợp những lộ trình khác nhau, nên cho em xin thêm trình độ gần nhất và mục tiêu của con. Như vậy mình sẽ so sánh chi phí trên đúng phương án học, tránh chọn gói chưa phù hợp rồi phải điều chỉnh giữa chừng.",
  },
  {
    group: "Cambridge YLE",
    title: "Giải thích Starters - Movers - Flyers",
    text: "Starters, Movers và Flyers không chỉ là ba kỳ thi, mà là ba cột mốc phát triển năng lực. Ở Starters, con xử lý ngôn ngữ rất quen thuộc; lên Movers, con có thể giao tiếp đơn giản trong đời sống; tới Flyers, con sử dụng tiếng Anh độc lập hơn ở mức A2. Vì vậy, mình chọn cấp độ theo năng lực thực tế chứ không chỉ theo tuổi.",
  },
  {
    group: "Cambridge YLE",
    title: "Từ A1 Movers lên A2 Flyers",
    text: "Ở A1 Movers, con thường đã giao tiếp được trong tình huống quen thuộc nhưng câu còn ngắn và phụ thuộc gợi ý. Chặng A2 Flyers cần giúp con theo dõi hội thoại dài hơn, kể - mô tả có liên kết và đọc viết độc lập hơn. Mục tiêu không đơn thuần là làm đề khó hơn, mà là mở rộng khả năng sử dụng tiếng Anh.",
  },
  {
    group: "Thuyết phục YLE",
    title: "Vì sao nên xây nền Cambridge từ sớm?",
    text: "Ở giai đoạn 7-12 tuổi, điều quan trọng không phải là cho con chạy theo một chứng chỉ thật sớm, mà là giúp con hình thành nền tảng ngôn ngữ và thói quen sử dụng tiếng Anh đúng cách. Lộ trình Cambridge YLE chia năng lực thành các cột mốc vừa sức, từ hiểu chỉ dẫn, phản xạ trong tình huống quen thuộc đến đọc, viết và diễn đạt độc lập hơn. Khi được học qua hoạt động và thực hành phù hợp lứa tuổi, con vừa có mục tiêu rõ ràng, vừa không bị cuốn vào áp lực luyện thi quá sớm.",
  },
  {
    group: "Thuyết phục YLE",
    title: "YLE mang lại gì ngoài chứng chỉ?",
    text: "Em nghĩ giá trị lớn nhất của YLE không nằm ở tấm chứng chỉ, mà ở những việc con thực sự làm được sau mỗi chặng. Starters giúp con xử lý ngôn ngữ rất quen thuộc; Movers mở rộng khả năng giao tiếp trong đời sống; Flyers hướng tới mức A2, khi con có thể nghe, đọc, kể lại và viết những nội dung có liên kết ở mức cơ bản. Chứng chỉ là một cột mốc ghi nhận, còn năng lực sử dụng tiếng Anh và sự tự tin của con mới là tài sản theo con lâu dài.",
  },
  {
    group: "Thuyết phục YLE",
    title: "YLE tạo nền cho IELTS như thế nào?",
    text: "Cambridge YLE không phải IELTS thu nhỏ, nhưng là nền móng rất tốt cho hành trình sau này. Khi hoàn thành đúng chặng Starters, Movers và Flyers, con từng bước xây vốn từ, ngữ pháp, khả năng nghe hiểu, đọc văn bản, viết có cấu trúc và phản xạ giao tiếp. Nhờ vậy, khi bước sang tuổi Teens, con có thể phát triển tiếp lên B1-B2 hoặc chuẩn bị IELTS mà không phải quay lại lấp quá nhiều lỗ hổng nền tảng. Mình đang đầu tư để chặng học thuật sau này thuận lợi hơn, chứ không ép con luyện IELTS sớm.",
  },
  {
    group: "Thuyết phục YLE",
    title: "YLE và sự tự tin của trẻ",
    text: "Với trẻ nhỏ, sự tự tin được hình thành từ những trải nghiệm thành công vừa sức. Khi con hiểu được câu hỏi, diễn đạt được một ý, kể được một câu chuyện ngắn hay hoàn thành một nhiệm vụ bằng tiếng Anh, con bắt đầu nhìn ngôn ngữ như một công cụ mình có thể sử dụng. Lộ trình YLE giúp những tiến bộ nhỏ đó trở nên rõ ràng và có hệ thống. Vì vậy, mục tiêu không chỉ là điểm thi mà còn là giúp con dám nói, dám thử và duy trì hứng thú học lâu dài.",
  },
  {
    group: "Thuyết phục YLE",
    title: "YLE mở rộng cơ hội tương lai",
    text: "Ở độ tuổi này, mình chưa cần quyết định trước con sẽ du học hay làm công việc nào. Điều đáng đầu tư là năng lực giúp con có nhiều lựa chọn hơn trong tương lai. Một nền tiếng Anh vững từ YLE giúp con tiếp cận học liệu quốc tế phù hợp lứa tuổi, giao tiếp với môi trường rộng hơn và chuyển tiếp thuận lợi sang tiếng Anh học thuật khi cần. YLE không tự tạo ra mọi cơ hội, nhưng giúp con có nền tảng để nắm bắt cơ hội tốt hơn khi các mục tiêu học tập dần rõ ràng.",
  },
  {
    group: "Gợi ý sản phẩm",
    title: "Gợi ý SpeakWell",
    text: "Với độ tuổi 7-12 và nhu cầu hiện tại, em đề xuất gia đình ưu tiên SpeakWell để con phát triển đồng đều Nghe, Nói, Đọc, Viết theo lộ trình Cambridge. Chương trình kết hợp lớp cùng giáo viên, học liệu tương tác, LMS và luyện nói; chứng chỉ là cột mốc ghi nhận, còn năng lực sử dụng tiếng Anh mới là mục tiêu chính.",
  },
  {
    group: "Gợi ý sản phẩm",
    title: "Gợi ý Easy PASS",
    text: "Con đang ở giai đoạn Teens và mục tiêu trước mắt là củng cố tiếng Anh toàn diện, nên Easy PASS phù hợp hơn việc đi thẳng vào luyện thi. Lộ trình A1-B2 giúp con phát triển bốn kỹ năng, hỗ trợ học trên trường và tạo nền cho mục tiêu học thuật sau này. Em đề xuất mình xác định đúng mức đầu vào trước.",
  },
  {
    group: "Gợi ý sản phẩm",
    title: "Gợi ý Easy IELTS",
    text: "Vì con đã có mục tiêu sử dụng IELTS, band hiện tại và mốc thời gian tương đối rõ, mình có thể xây lộ trình Easy IELTS theo khoảng cách cần cải thiện. Em sẽ không chỉ nhìn overall, mà cần xem kỹ năng nào đang là điểm nghẽn để chọn chặng học và kế hoạch tự luyện phù hợp.",
  },
  {
    group: "Chuyển tiếp",
    title: "Sau Flyers nên học gì?",
    text: "Sau Flyers, mình chưa cần mặc định chuyển sang IELTS. Nếu con cần tiếng Anh tổng quát, hỗ trợ học ở THCS và phát triển từ A2 lên B1-B2, Easy PASS là hướng hợp lý. Nếu con đã có nền tảng, mục tiêu band và thời điểm sử dụng chứng chỉ rõ, lúc đó mới cân nhắc Easy IELTS.",
  },
  {
    group: "Chuyển tiếp",
    title: "Học sinh 12 tuổi",
    text: "Mười hai tuổi là điểm chuyển tiếp nên em không muốn quyết định chỉ theo tuổi. Nếu con vẫn đang hoàn thiện YLE, mình có thể tiếp tục chặng phù hợp của SpeakWell. Nếu con đã qua A2 và cần tiếng Anh tổng quát cho Teens, Easy PASS hợp lý hơn. Mình nên dựa vào đánh giá đầu vào để chọn đúng.",
  },
  {
    group: "IELTS & đại học",
    title: "Vai trò của IELTS với đại học",
    text: "IELTS có thể mở rộng lựa chọn học tập khi được đặt trong kế hoạch đại học cụ thể: chuẩn đầu vào, phương án xét tuyển, học chương trình quốc tế hoặc chuẩn bị năng lực học thuật. Tuy nhiên, chính sách từng trường và từng năm có thể thay đổi, nên mình sẽ xác minh yêu cầu mục tiêu trước rồi mới xác định band và thời điểm thi.",
  },
  {
    group: "Thuyết phục IELTS",
    title: "Vì sao nên chuẩn bị IELTS từ sớm?",
    text: "Chuẩn bị IELTS từ sớm không có nghĩa là luyện đề càng sớm càng tốt. Khi con từ 12 tuổi trở lên, có nền tảng phù hợp và mục tiêu tương đối rõ, việc bắt đầu đúng thời điểm giúp con có đủ quỹ thời gian để phát triển bốn kỹ năng, sửa điểm yếu và hình thành thói quen tự học thay vì chạy nước rút trước hạn xét tuyển. Em muốn mình xác định band hiện tại, band mục tiêu và thời điểm cần chứng chỉ trước, rồi mới thiết kế một lộ trình vừa sức và bền vững cho con.",
  },
  {
    group: "Thuyết phục IELTS",
    title: "IELTS trang bị tư duy học thuật",
    text: "Nếu được học đúng phương pháp, IELTS không chỉ là luyện dạng đề. Quá trình học giúp con tập đọc để xác định luận điểm và bằng chứng, nghe để chọn lọc thông tin, viết theo cấu trúc logic và trình bày quan điểm có lý do. Đây đều là những năng lực quan trọng khi học ở bậc đại học. Tuy nhiên, giá trị này chỉ hình thành khi con được phát triển ngôn ngữ, tư duy và khả năng tự đánh giá song song, chứ không chỉ ghi nhớ mẹo làm bài.",
  },
  {
    group: "Thuyết phục IELTS",
    title: "IELTS hỗ trợ kế hoạch du học",
    text: "Với kế hoạch du học hoặc học chương trình quốc tế, IELTS có thể là một điều kiện ngôn ngữ quan trọng trong hồ sơ, đồng thời giúp con chuẩn bị cho việc đọc tài liệu, nghe giảng, viết bài và trao đổi trong môi trường học thuật. Mỗi trường, chương trình và quốc gia có yêu cầu khác nhau, nên em sẽ cùng gia đình kiểm tra đúng chuẩn đầu vào trước khi chốt band mục tiêu. Như vậy, con học vì một đích đến cụ thể và tránh đầu tư theo một mốc điểm chung chung.",
  },
  {
    group: "Thuyết phục IELTS",
    title: "IELTS và cơ hội nghề nghiệp tương lai",
    text: "Một band IELTS tốt có thể giúp hồ sơ của con có thêm dữ liệu chứng minh năng lực tiếng Anh ở những bối cảnh phù hợp. Nhưng về dài hạn, điều có giá trị hơn là khả năng đọc tài liệu chuyên môn, viết và thuyết trình rõ ràng, trao đổi với đồng nghiệp hoặc đối tác quốc tế. Vì vậy, mình không nên chỉ hỏi con cần bao nhiêu điểm, mà cần nhìn xem lộ trình có thực sự giúp con sử dụng tiếng Anh cho học tập và công việc sau này hay không.",
  },
  {
    group: "Thuyết phục IELTS",
    title: "IELTS và năng lực công dân toàn cầu",
    text: "Một chứng chỉ không tự biến con thành công dân toàn cầu. Điều tạo ra năng lực hội nhập là khả năng tiếp cận tri thức từ nhiều nguồn, giao tiếp với người có nền tảng khác nhau và diễn đạt quan điểm một cách rõ ràng, có căn cứ. IELTS có thể là một lộ trình rèn luyện các năng lực đó nếu con học để sử dụng ngôn ngữ thật, không chỉ để vượt qua kỳ thi. Khi ấy, điểm số vừa là cột mốc, vừa phản ánh một phần năng lực sẵn sàng cho môi trường rộng hơn.",
  },
  {
    group: "Thuyết phục IELTS",
    title: "IELTS mở rộng quyền lựa chọn",
    text: "Gia đình chưa nhất thiết phải quyết định ngay con sẽ học trường nào hay làm nghề gì. Lợi ích của việc chuẩn bị có kế hoạch là đến thời điểm cần lựa chọn, con không bị giới hạn chỉ vì thiếu năng lực tiếng Anh hoặc không kịp hoàn thành điều kiện chứng chỉ. IELTS không bảo đảm một suất học hay một công việc, nhưng có thể mở thêm phương án về xét tuyển, chương trình quốc tế, du học và môi trường nghề nghiệp. Mục tiêu của mình là tạo thêm quyền lựa chọn cho con, không chạy theo chứng chỉ vì xu hướng.",
  },
  {
    group: "Bước tiếp theo",
    title: "Chưa đủ dữ liệu để kết luận",
    text: "Với thông tin hiện tại, em chưa muốn chốt vội một khóa học vì mình còn thiếu dữ liệu về trình độ và khoảng cách giữa các kỹ năng. Bước hợp lý nhất là đánh giá đầu vào, sau đó em sẽ giải thích rõ con đang ở đâu, mục tiêu tiếp theo là gì và vì sao lộ trình được đề xuất phù hợp.",
  },
  {
    group: "Bước tiếp theo",
    title: "Mời đánh giá đầu vào",
    text: "Để tư vấn có căn cứ, em đề xuất con thực hiện đánh giá đầu vào trước. Kết quả không chỉ dùng để xếp lớp mà giúp mình nhìn rõ điểm mạnh, điểm cần cải thiện và mức mục tiêu phù hợp. Sau đó em sẽ cùng chị rà lại lộ trình, thời lượng và cách theo dõi tiến bộ của con.",
  },
];

const objections = [
  {
    q: "Con còn nhỏ, học Cambridge có tạo áp lực không?",
    answer:
      "Em hiểu lo lắng của chị vì nếu chương trình quá thiên về luyện đề, trẻ dễ mất hứng thú. Cambridge YLE nên được dùng như khung năng lực và cột mốc tiến bộ. Với học sinh 7-12 tuổi, mình ưu tiên từ vựng, phát âm, nghe hiểu và phản xạ qua hoạt động; chỉ làm quen dạng thi khi nền tảng đã sẵn sàng.",
    next: "Hỏi thêm: Con từng có trải nghiệm nào khiến con sợ hoặc không thích học tiếng Anh?",
  },
  {
    q: "Học SpeakWell có phải chỉ để luyện thi chứng chỉ?",
    answer:
      "Không ạ. SpeakWell phát triển đồng thời bốn kỹ năng và dùng Beginners, Starters, Movers, Flyers như những cột mốc có thể quan sát. Chứng chỉ ghi nhận kết quả; giá trị dài hạn là con hiểu, phản hồi và sử dụng tiếng Anh ngày càng độc lập.",
    next: "Đề xuất: thống nhất một mục tiêu sử dụng thực tế bên cạnh mục tiêu chứng chỉ.",
  },
  {
    q: "Con 12 tuổi nên học SpeakWell hay Easy PASS?",
    answer:
      "Mười hai tuổi là giai đoạn chuyển tiếp nên tuổi chưa đủ để kết luận. Nếu con vẫn cần hoàn thiện chặng YLE, SpeakWell có thể phù hợp; nếu đã ở khoảng A2 và cần General English cho THCS, Easy PASS thường hợp lý hơn. Kết quả đầu vào và mục tiêu 6-12 tháng sẽ quyết định.",
    next: "Hỏi thêm: Con đã học hoặc thi Cambridge ở cấp độ nào và mục tiêu gần nhất là gì?",
  },
  {
    q: "Tại sao không học IELTS càng sớm càng tốt?",
    answer:
      "IELTS đo năng lực ngôn ngữ trong bối cảnh học thuật, nên hiệu quả phụ thuộc vào nền tảng, tư duy và mục tiêu sử dụng. Bắt đầu quá sớm khi chưa sẵn sàng dễ khiến con học mẹo và tiến bộ thiếu bền vững. Mình nên chọn đúng thời điểm dựa trên trình độ, band mục tiêu và thời hạn cần chứng chỉ.",
    next: "Hỏi thêm: Gia đình dự kiến dùng IELTS cho quyết định học tập nào và vào năm nào?",
  },
  {
    q: "Con học trên trường khá rồi, có cần học thêm không?",
    answer:
      "Điểm trên trường là một dữ liệu quan trọng nhưng chưa phản ánh đầy đủ khả năng sử dụng bốn kỹ năng. Mình nên kiểm tra xem con có nghe hiểu ở tốc độ tự nhiên, duy trì hội thoại, đọc văn bản mới và viết có tổ chức hay không. Nếu các năng lực này đã tốt, lộ trình bổ sung cần được thiết kế ở mức cao hơn chứ không học lại.",
    next: "Đề xuất: dùng một đánh giá bốn kỹ năng thay vì chỉ nhìn điểm tổng kết.",
  },
  {
    q: "Con làm bài tốt nhưng vẫn ngại giao tiếp.",
    answer:
      "Đây thường là khoảng cách giữa kiến thức khai báo và khả năng sử dụng tự động. Con cần đủ đầu vào nghe, cơ hội nói trong tình huống có ý nghĩa, phản hồi đúng lúc và sự lặp lại trong môi trường an toàn. Vì vậy, em sẽ xem cả tần suất thực hành và mức chủ động, không chỉ số câu đúng.",
    next: "Hỏi thêm: Con ngại vì thiếu từ, sợ sai hay ít có môi trường nói?",
  },
  {
    q: "Học online liệu có cải thiện giao tiếp thật không?",
    answer:
      "Hiệu quả không do online hay offline quyết định riêng lẻ, mà do mật độ tương tác, chất lượng phản hồi, thời lượng thực hành và mức độ duy trì. Lớp online có lợi thế về dữ liệu, học liệu và khả năng luyện thường xuyên; nhưng con vẫn cần tham gia chủ động và hoàn thành phần tự luyện.",
    next: "Đề xuất: theo dõi thời lượng nói, mức tham gia và sản phẩm ngôn ngữ sau từng giai đoạn.",
  },
  {
    q: "Con mất gốc, liệu có theo kịp lớp không?",
    answer:
      "Mất gốc thường là mô tả chung, cần tách thành thiếu từ vựng, ngữ pháp không hệ thống, yếu nghe hay thiếu thói quen học. Nếu xác định đúng điểm xuất phát và chọn lớp phù hợp, con không phải chạy theo chương trình vượt quá nền tảng. Quan trọng là mục tiêu gần đủ nhỏ và được theo dõi.",
    next: "Bước tiếp theo: đánh giá đầu vào và chọn một năng lực ưu tiên trong 8-12 tuần đầu.",
  },
  {
    q: "Gia đình muốn con đạt band nhanh trong vài tháng.",
    answer:
      "Em hiểu gia đình cần một mốc rõ. Để đánh giá tính khả thi, mình cần ba dữ liệu: band hiện tại có độ tin cậy, band mục tiêu và số giờ học thực tế mỗi tuần. Khoảng cách band không tăng tuyến tính; từng kỹ năng có thể cần thời gian khác nhau. Em sẽ đề xuất mốc trung gian để kiểm soát rủi ro.",
    next: "Hỏi thêm: Điểm gần nhất được thi trong điều kiện nào và kỹ năng thấp nhất là gì?",
  },
  {
    q: "Học phí cao hơn nơi khác, khác biệt nằm ở đâu?",
    answer:
      "So sánh hợp lý nhất là trên tổng giá trị lộ trình: chất lượng giáo viên, thời lượng tương tác thực, học liệu - LMS, phản hồi, đánh giá tiến bộ và cơ chế đồng hành. Một mức phí thấp hơn chưa chắc tiết kiệm nếu sai trình độ hoặc thiếu thực hành. Em sẽ cùng chị đối chiếu trên đúng mục tiêu của con.",
    next: "Đề xuất: lập bảng so sánh theo 5 tiêu chí thay vì chỉ so đơn giá mỗi buổi.",
  },
  {
    q: "Con bận, không có nhiều thời gian tự học.",
    answer:
      "Đây là dữ liệu cần đưa vào thiết kế lộ trình, không nên bỏ qua. Tiến bộ ngôn ngữ cần phân bố thời gian đủ đều; nếu chỉ học live mà không củng cố, hiệu quả sẽ giảm. Mình có thể chọn mục tiêu vừa sức, lịch học phù hợp và một mức tự luyện tối thiểu có thể duy trì.",
    next: "Hỏi thêm: Con có thể cam kết khung thời gian cố định nào trong tuần?",
  },
  {
    q: "Làm sao biết con thực sự tiến bộ?",
    answer:
      "Không nên chỉ nhìn một điểm tổng. Mình theo dõi đồng thời mức nghe hiểu, độ dài và rõ của phát ngôn, khả năng vận dụng trong tình huống mới, chất lượng đọc - viết và kết quả đánh giá định kỳ. Tiến bộ đáng tin cậy cần có dữ liệu trước - sau và nhận xét theo tiêu chí.",
    next: "Đề xuất: thống nhất 2-3 chỉ báo quan sát được ngay khi bắt đầu khóa.",
  },
];

const isSpeakWellLevel = (level?: string) =>
  ["pre-a1", "starters", "movers", "flyers"].includes(level || "");

const hasPotentialProductRoute = (answers: AdvisorAnswers) => {
  const { age, level, goal } = answers;
  if (age === "7-11") {
    return (
      ["cambridge", "general", "communication"].includes(goal) &&
      (isSpeakWellLevel(level) || level === "unknown")
    );
  }
  if (age === "12") {
    if (goal === "cambridge") {
      return isSpeakWellLevel(level) || level === "unknown";
    }
    if (["general", "communication"].includes(goal)) {
      return level !== "b2-plus";
    }
    return goal === "ielts";
  }
  if (age === "13-18") {
    return (
      goal === "ielts" ||
      (["general", "communication"].includes(goal) && level !== "b2-plus")
    );
  }
  return age === "over-18" && goal === "ielts";
};

const advisorQuestions: AdvisorQuestion[] = [
  {
    key: "age",
    title: "Học sinh đang ở độ tuổi nào?",
    note: "Đây là điều kiện sàng lọc bắt buộc. Hệ thống sẽ không đề xuất sản phẩm nằm ngoài độ tuổi.",
    options: [
      ["under-7", "Dưới 7 tuổi", "Chưa thuộc độ tuổi của 3 chương trình"],
      ["7-11", "7-11 tuổi", "Tiểu học"],
      ["12", "12 tuổi", "Giai đoạn chuyển tiếp"],
      ["13-18", "13-18 tuổi", "THCS - THPT"],
      ["over-18", "Trên 18 tuổi", "Người học trưởng thành"],
    ],
  },
  {
    key: "level",
    title: "Trình độ gần nhất của học sinh?",
    note: "Chọn mức gần nhất; ở câu tiếp theo, hãy cho biết căn cứ của đánh giá này.",
    options: [
      ["pre-a1", "Beginners / Pre-A1", "Mới làm quen tiếng Anh"],
      ["starters", "Starters / Pre-A1", "Có nền tảng rất cơ bản"],
      ["movers", "Movers / A1", "Giao tiếp tình huống quen thuộc"],
      ["flyers", "Flyers / A2", "Sử dụng độc lập hơn"],
      ["b1", "B1", "Đã tương đối độc lập"],
      ["b2-plus", "B2 trở lên", "Nền tảng khá đến nâng cao"],
      ["ielts-band", "Đã có band IELTS", "Sẽ bổ sung band nếu chọn IELTS"],
      ["unknown", "Chưa xác định", "Cần đánh giá đầu vào"],
    ],
  },
  {
    key: "evidence",
    title: "Căn cứ nào xác định trình độ trên?",
    note: "Độ tin cậy của dữ liệu quyết định mức độ chắc chắn của đề xuất.",
    options: [
      ["certificate", "Chứng chỉ chính thức", "Cambridge, IELTS hoặc chứng chỉ tương đương"],
      ["recent-test", "Bài đánh giá gần đây", "Thi thử hoặc placement test có kết quả"],
      ["school", "Kết quả học ở trường", "Có dữ liệu nhưng chưa phản ánh đủ 4 kỹ năng"],
      ["self-report", "Phụ huynh/học sinh tự đánh giá", "Cần kiểm chứng trước khi xếp lớp"],
      ["none", "Chưa có căn cứ", "Bắt buộc đánh giá đầu vào"],
    ],
  },
  {
    key: "goal",
    title: "Mục tiêu ưu tiên của gia đình?",
    note: "Chọn mục tiêu sử dụng tiếng Anh quan trọng nhất, không chọn theo tên khóa học.",
    options: [
      ["cambridge", "Cambridge YLE", "Xây nền và hướng tới Starters/Movers/Flyers"],
      ["general", "Tiếng Anh tổng quát", "Bốn kỹ năng và hỗ trợ việc học ở trường"],
      ["communication", "Giao tiếp và phản xạ", "Ưu tiên khả năng sử dụng thực tế"],
      ["ielts", "IELTS với band mục tiêu", "Có nhu cầu sử dụng chứng chỉ cụ thể"],
      ["university", "Chuẩn bị cho đại học", "Chưa rõ có thực sự cần IELTS hay không"],
      ["unclear", "Chưa xác định", "Cần khai thác nhu cầu trước khi chọn khóa"],
    ],
  },
  {
    key: "cambridgeTarget",
    title: "Gia đình hướng tới cấp độ Cambridge nào?",
    note: "Cấp độ đích cần phù hợp với trình độ hiện tại và thời gian chuẩn bị.",
    showWhen: (answers) =>
      answers.goal === "cambridge" &&
      ["7-11", "12"].includes(answers.age) &&
      (isSpeakWellLevel(answers.level) || answers.level === "unknown"),
    options: [
      ["starters", "Starters", "Mốc Pre-A1"],
      ["movers", "Movers", "Mốc A1"],
      ["flyers", "Flyers", "Mốc A2"],
      ["not-sure", "Chưa xác định", "Cần test và tư vấn cấp độ phù hợp"],
    ],
  },
  {
    key: "ieltsCurrent",
    title: "Band IELTS hiện tại gần nhất?",
    note: "Nếu chưa thi trong điều kiện đủ tin cậy, chọn “Chưa có band”.",
    showWhen: (answers) =>
      answers.goal === "ielts" &&
      ["12", "13-18", "over-18"].includes(answers.age),
    options: [
      ["none", "Chưa có band", "Cần placement test"],
      ["2-3.5", "2.0-3.5", "Introduction / Foundation"],
      ["4-4.5", "4.0-4.5", "Preparation"],
      ["5-5.5", "5.0-5.5", "Intensive"],
      ["6-plus", "6.0 trở lên", "Master / mục tiêu nâng cao"],
    ],
  },
  {
    key: "ieltsTarget",
    title: "Band IELTS mục tiêu?",
    note: "Band mục tiêu phải gắn với yêu cầu sử dụng thực tế, không chỉ là một con số mong muốn.",
    showWhen: (answers) =>
      answers.goal === "ielts" &&
      ["12", "13-18", "over-18"].includes(answers.age),
    options: [
      ["4.5", "4.5", "Mục tiêu nền tảng"],
      ["5.5", "5.5", "Mục tiêu trung cấp"],
      ["6.5", "6.5", "Mốc phổ biến cho xét tuyển/học thuật"],
      ["7-plus", "7.0+", "Mục tiêu nâng cao"],
      ["not-sure", "Chưa xác định", "Cần đối chiếu yêu cầu trường/chương trình"],
    ],
  },
  {
    key: "weakestSkill",
    title: "Kỹ năng đang là điểm nghẽn lớn nhất?",
    note: "Điểm tổng không cho biết đầy đủ nơi cần ưu tiên thời lượng và phản hồi.",
    showWhen: (answers) =>
      answers.goal === "ielts" &&
      ["12", "13-18", "over-18"].includes(answers.age),
    options: [
      ["listening", "Listening", "Nghe hiểu và xử lý thông tin"],
      ["reading", "Reading", "Tốc độ và độ chính xác"],
      ["writing", "Writing", "Lập luận và kiểm soát ngôn ngữ"],
      ["speaking", "Speaking", "Độ trôi chảy và phát triển ý"],
      ["unknown", "Chưa xác định", "Cần chẩn đoán theo từng kỹ năng"],
    ],
  },
  {
    key: "timeline",
    title: "Gia đình cần đạt mục tiêu vào thời điểm nào?",
    note: "Thời hạn giúp đánh giá tính khả thi và thiết kế mốc trung gian.",
    showWhen: hasPotentialProductRoute,
    options: [
      ["under-6", "Dưới 6 tháng", "Cần kiểm tra kỹ khoảng cách đầu vào - đầu ra"],
      ["6-12", "6-12 tháng", "Có thể thiết kế mốc theo giai đoạn"],
      ["over-12", "Trên 12 tháng", "Ưu tiên phát triển bền vững"],
      ["no-deadline", "Chưa có thời hạn", "Cần thống nhất một mốc đánh giá gần"],
    ],
  },
  {
    key: "capacity",
    title: "Mức thời gian học sinh có thể duy trì mỗi tuần?",
    note: "Tính khả thi phụ thuộc cả giờ học với giáo viên và thời gian tự luyện.",
    showWhen: hasPotentialProductRoute,
    options: [
      ["under-2", "Dưới 2 giờ/tuần", "Cần thu hẹp mục tiêu hoặc kéo dài thời gian"],
      ["2-4", "2-4 giờ/tuần", "Phù hợp lộ trình ổn định nếu duy trì đều"],
      ["over-4", "Trên 4 giờ/tuần", "Có dư địa cho mục tiêu chuyên sâu"],
      ["unknown", "Chưa xác định", "Cần chốt lịch thực tế với gia đình"],
    ],
  },
];

const advisorOptionLabels = Object.fromEntries(
  advisorQuestions.flatMap((question) =>
    question.options.map(([value, label]) => [
      `${question.key}:${value}`,
      label,
    ]),
  ),
);

const optionLabel = (key: string, value?: string) =>
  value ? advisorOptionLabels[`${key}:${value}`] || value : "Chưa có dữ liệu";

function buildAdvisorRecommendation(
  answers: AdvisorAnswers,
): AdvisorRecommendation {
  const { age, level, evidence, goal, timeline, capacity } = answers;
  const lowEvidence = ["self-report", "none"].includes(evidence);
  const levelUnknown = level === "unknown";
  const noTimeline = timeline === "no-deadline";
  const lowCapacity = capacity === "under-2";
  const commonMissing: string[] = [];

  if (levelUnknown || evidence === "none") {
    commonMissing.push("Trình độ đầu vào có độ tin cậy đủ để xếp lớp.");
  } else if (lowEvidence) {
    commonMissing.push("Kết quả đánh giá đầu vào để kiểm chứng nhận định của gia đình.");
  }
  if (noTimeline) {
    commonMissing.push("Mốc thời gian cụ thể để thiết kế tiến độ và điểm kiểm tra.");
  }
  if (capacity === "unknown") {
    commonMissing.push("Khung thời gian học và tự luyện có thể duy trì mỗi tuần.");
  }

  const confidence: AdvisorRecommendation["confidence"] =
    levelUnknown || evidence === "none"
      ? "Thấp"
      : lowEvidence || noTimeline || capacity === "unknown"
        ? "Trung bình"
        : "Cao";

  const noMatch = (
    verdict: string,
    summary: string,
    rationale: string[],
    actions: string[],
    missing: string[] = commonMissing,
  ): AdvisorRecommendation => ({
    product: "Chưa nên chốt sản phẩm",
    verdict,
    tone: "neutral",
    confidence: "Thấp",
    summary,
    eligibility: [
      `Độ tuổi: ${optionLabel("age", age)}.`,
      `Trình độ khai báo: ${optionLabel("level", level)}.`,
      `Mục tiêu: ${optionLabel("goal", goal)}.`,
    ],
    rationale,
    fitAnalysis: [],
    missing,
    actions,
  });

  if (age === "under-7") {
    return noMatch(
      "Ngoài phạm vi độ tuổi",
      "Ba chương trình trong công cụ hiện chưa có lựa chọn phù hợp cho học sinh dưới 7 tuổi.",
      [
        "SpeakWell chỉ áp dụng từ 7-12 tuổi.",
        "Easy PASS áp dụng từ 12-18 tuổi; Easy IELTS áp dụng từ 12 tuổi.",
      ],
      [
        "Không cố gắng quy đổi sang một sản phẩm đang có.",
        "Chuyển AS để kiểm tra lựa chọn dành cho nhóm tuổi nhỏ hơn.",
      ],
    );
  }

  if (goal === "unclear" || goal === "university") {
    return noMatch(
      "Cần làm rõ mục tiêu",
      goal === "university"
        ? "Chuẩn bị cho đại học chưa đồng nghĩa phải học IELTS. Cần xác định yêu cầu đầu vào của trường hoặc chương trình trước."
        : "Chưa có mục tiêu sử dụng tiếng Anh đủ rõ để lựa chọn lộ trình có trách nhiệm.",
      [
        "Tên chứng chỉ không nên được dùng thay cho nhu cầu học tập thực tế.",
        "Sản phẩm chỉ nên được đề xuất sau khi biết mục tiêu ưu tiên và cách đo đầu ra.",
      ],
      [
        "Hỏi trường/ngành/chương trình dự kiến và yêu cầu tiếng Anh tương ứng.",
        "Nếu chưa có yêu cầu chứng chỉ, làm rõ nhu cầu General English, giao tiếp hay Cambridge.",
      ],
      [
        "Mục tiêu sử dụng tiếng Anh cụ thể.",
        "Thời điểm cần đạt và tiêu chí đầu ra có thể quan sát.",
      ],
    );
  }

  if (age === "7-11") {
    if (goal === "ielts") {
      return noMatch(
        "Không phù hợp theo độ tuổi",
        "Không đề xuất Easy IELTS cho học sinh dưới 12 tuổi, kể cả khi gia đình mong muốn chuẩn bị IELTS sớm.",
        [
          "Easy IELTS chỉ áp dụng từ 12 tuổi.",
          "Ở giai đoạn này cần ưu tiên năng lực ngôn ngữ phù hợp lứa tuổi hơn là kỹ thuật luyện thi học thuật.",
        ],
        [
          "Làm rõ nhu cầu đằng sau mục tiêu IELTS: nền tảng 4 kỹ năng, giao tiếp hay cột mốc Cambridge.",
          isSpeakWellLevel(level)
            ? "Có thể đánh giá đầu vào để xem xét SpeakWell nếu gia đình đồng thuận mục tiêu nền tảng/Cambridge."
            : "Chuyển AS vì trình độ khai báo không nằm trong lộ trình SpeakWell.",
        ],
      );
    }
    if (!isSpeakWellLevel(level) && !levelUnknown) {
      return noMatch(
        "Vượt phạm vi trình độ",
        "Học sinh đúng độ tuổi SpeakWell nhưng trình độ khai báo đã vượt lộ trình Beginners-Flyers/A2.",
        [
          "SpeakWell không nên được đề xuất chỉ vì học sinh còn trong độ tuổi 7-12.",
          "Easy PASS và Easy IELTS lại chưa phù hợp vì học sinh dưới 12 tuổi.",
        ],
        [
          "Kiểm chứng trình độ bằng bài đánh giá đủ 4 kỹ năng.",
          "Nếu kết quả vẫn trên A2, chuyển AS để thiết kế phương án phù hợp.",
        ],
      );
    }
    return {
      product: "SpeakWell",
      verdict: lowEvidence || levelUnknown ? "Đề xuất có điều kiện" : "Phù hợp sơ bộ",
      tone: "green",
      confidence,
      summary:
        "Học sinh nằm trong độ tuổi 7-12 và mục tiêu phù hợp với lộ trình xây nền Beginners-Flyers/A2.",
      eligibility: [
        "Đạt điều kiện tuổi của SpeakWell: 7-12 tuổi.",
        `Trình độ khai báo: ${optionLabel("level", level)}.`,
        `Mục tiêu: ${optionLabel("goal", goal)}.`,
      ],
      rationale: [
        goal === "cambridge"
          ? `Gia đình đã xác định cột mốc ${optionLabel("cambridgeTarget", answers.cambridgeTarget)}.`
          : "Gia đình ưu tiên năng lực tổng quát/giao tiếp ở độ tuổi tiểu học.",
        "SpeakWell phát triển đồng thời 4 kỹ năng và định hướng Cambridge YLE theo lộ trình.",
      ],
      fitAnalysis: [
        {
          angle: "Độ tuổi & giai đoạn phát triển",
          status: "Phù hợp",
          explanation:
            "Con đang ở nhóm 7-11 tuổi, đúng giai đoạn SpeakWell được thiết kế để xây nền ngôn ngữ, phản xạ và sự tự tin trước khi chuyển sang lộ trình Teens.",
        },
        {
          angle: "Nền tảng hiện tại",
          status:
            levelUnknown || lowEvidence ? "Cần xác minh" : "Phù hợp",
          explanation:
            levelUnknown || lowEvidence
              ? "Trình độ đang dựa trên dữ liệu chưa đủ tin cậy; cần đánh giá đầu vào để chọn đúng Beginners, Starters, Movers hoặc Flyers."
              : `Mức ${optionLabel("level", level)} nằm trong phạm vi Beginners-Flyers/A2 mà SpeakWell phát triển.`,
        },
        {
          angle: "Mục tiêu học tập",
          status: "Phù hợp",
          explanation:
            goal === "cambridge"
              ? `Lộ trình Cambridge YLE của SpeakWell đi đúng cột mốc gia đình đang hướng tới: ${optionLabel("cambridgeTarget", answers.cambridgeTarget)}.`
              : "SpeakWell phù hợp vì gia đình đang ưu tiên năng lực 4 kỹ năng và giao tiếp phù hợp lứa tuổi, thay vì luyện thi học thuật sớm.",
        },
        {
          angle: "Phương pháp & trải nghiệm học",
          status: "Phù hợp",
          explanation:
            "Chương trình kết hợp lớp giáo viên, học liệu tương tác, LMS và công cụ AI, phù hợp với nhu cầu vừa được hướng dẫn vừa có môi trường thực hành thường xuyên.",
        },
        {
          angle: "Thời hạn & khả năng duy trì",
          status:
            lowCapacity || capacity === "unknown"
              ? "Cần điều chỉnh"
              : "Phù hợp",
          explanation: lowCapacity
            ? "Quỹ học dưới 2 giờ/tuần chưa tương xứng với mục tiêu; cần giảm kỳ vọng đầu ra hoặc kéo dài thời gian."
            : capacity === "unknown"
              ? "Gia đình chưa xác định được quỹ học hằng tuần; cần chốt lịch trước khi cam kết tiến độ."
              : `Quỹ học ${optionLabel("capacity", capacity).toLowerCase()} tạo điều kiện để duy trì lộ trình đều đặn; thời hạn ${optionLabel("timeline", timeline).toLowerCase()}.`,
        },
      ],
      missing: commonMissing,
      actions: [
        "Đánh giá đầu vào để chọn đúng Beginners/Starters/Movers/Flyers.",
        "Thống nhất 1-2 năng lực có thể quan sát trong 8-12 tuần đầu.",
        lowCapacity
          ? "Điều chỉnh mục tiêu vì quỹ thời gian dưới 2 giờ/tuần."
          : "Chốt lịch học và mức tự luyện có thể duy trì đều.",
      ],
    };
  }

  if (age === "over-18" && goal !== "ielts") {
    return noMatch(
      "Không thuộc danh mục 3 sản phẩm",
      "SpeakWell và Easy PASS đều không phù hợp độ tuổi. Với mục tiêu giao tiếp hoặc General English, cần chuyển sang giải pháp dành cho người lớn.",
      [
        "SpeakWell giới hạn 7-12 tuổi.",
        "Easy PASS giới hạn 12-18 tuổi.",
      ],
      [
        "Chuyển AS hoặc kiểm tra Easy SPEAK for Adults.",
        "Không chuyển hướng sang Easy IELTS nếu người học không có nhu cầu chứng chỉ.",
      ],
    );
  }

  if (goal === "cambridge" && age !== "12") {
    return noMatch(
      "Quá tuổi của SpeakWell",
      "Không đề xuất SpeakWell cho học sinh trên 12 tuổi, dù gia đình chọn mục tiêu Cambridge.",
      [
        "Độ tuổi là điều kiện loại trừ bắt buộc trước khi xét mục tiêu.",
        "Danh mục hiện không có khóa Cambridge YLE dành cho nhóm trên 12 tuổi.",
      ],
      [
        "Làm rõ gia đình cần chứng chỉ Cambridge cụ thể hay chỉ cần phát triển tiếng Anh tổng quát.",
        age === "13-18"
          ? "Nếu mục tiêu là General English, đánh giá đầu vào để xem xét Easy PASS; nếu là IELTS, xác định band và thời hạn."
          : "Chuyển AS để tìm giải pháp phù hợp độ tuổi.",
      ],
    );
  }

  if (goal === "ielts") {
    const ieltsMissing = [...commonMissing];
    if (answers.ieltsCurrent === "none") {
      ieltsMissing.push("Band đầu vào theo từng kỹ năng trong điều kiện đánh giá tin cậy.");
    }
    if (answers.ieltsTarget === "not-sure") {
      ieltsMissing.push("Band mục tiêu gắn với yêu cầu trường/chương trình.");
    }
    if (answers.weakestSkill === "unknown") {
      ieltsMissing.push("Kỹ năng thấp nhất và nguyên nhân điểm nghẽn.");
    }
    const conditional =
      ieltsMissing.length > 0 || lowCapacity || timeline === "under-6";
    return {
      product: "Easy IELTS",
      verdict: conditional ? "Đề xuất có điều kiện" : "Phù hợp sơ bộ",
      tone: "pink",
      confidence:
        answers.ieltsCurrent === "none" || answers.ieltsTarget === "not-sure"
          ? "Thấp"
          : confidence,
      summary:
        "Người học từ 12 tuổi và có mục tiêu IELTS cụ thể; cần xếp đúng chặng theo band đầu vào, band đích và quỹ thời gian.",
      eligibility: [
        "Đạt điều kiện tuổi của Easy IELTS: từ 12 tuổi.",
        `Band hiện tại: ${optionLabel("ieltsCurrent", answers.ieltsCurrent)}.`,
        `Band mục tiêu: ${optionLabel("ieltsTarget", answers.ieltsTarget)}.`,
      ],
      rationale: [
        `Kỹ năng cần ưu tiên: ${optionLabel("weakestSkill", answers.weakestSkill)}.`,
        `Thời hạn: ${optionLabel("timeline", timeline)}; khả năng duy trì: ${optionLabel("capacity", capacity)}.`,
        "Easy IELTS có lộ trình từ 2.0-2.5 đến 7.0+, không mặc định yêu cầu B1 mới được bắt đầu.",
      ],
      fitAnalysis: [
        {
          angle: "Độ tuổi & định hướng",
          status: "Phù hợp",
          explanation:
            "Người học từ 12 tuổi, đạt điều kiện độ tuổi và đã có mục tiêu IELTS thực sự thay vì chỉ chọn chứng chỉ theo xu hướng.",
        },
        {
          angle: "Khoảng cách band",
          status:
            answers.ieltsCurrent === "none" ||
            answers.ieltsTarget === "not-sure"
              ? "Cần xác minh"
              : "Phù hợp",
          explanation:
            answers.ieltsCurrent === "none"
              ? "Chưa có band đầu vào đáng tin cậy nên chưa thể xác định chặng học; Easy IELTS phù hợp về hướng nhưng cần placement test trước."
              : answers.ieltsTarget === "not-sure"
                ? `Đã có band hiện tại ${optionLabel("ieltsCurrent", answers.ieltsCurrent)}, nhưng cần xác định band đích theo yêu cầu trường hoặc chương trình.`
                : `Band hiện tại ${optionLabel("ieltsCurrent", answers.ieltsCurrent)} và mục tiêu ${optionLabel("ieltsTarget", answers.ieltsTarget)} có thể được đối chiếu với lộ trình Easy IELTS từ 2.0-2.5 đến 7.0+.`,
        },
        {
          angle: "Mục tiêu năng lực",
          status: "Phù hợp",
          explanation:
            "Easy IELTS không chỉ luyện dạng bài mà phát triển đồng thời năng lực ngôn ngữ, tư duy học thuật và chiến lược theo tiêu chí chấm, phù hợp với mục tiêu sử dụng IELTS dài hạn.",
        },
        {
          angle: "Điểm nghẽn kỹ năng",
          status:
            answers.weakestSkill === "unknown"
              ? "Cần xác minh"
              : "Phù hợp",
          explanation:
            answers.weakestSkill === "unknown"
              ? "Chưa xác định kỹ năng thấp nhất; cần chẩn đoán đủ 4 kỹ năng để phân bổ thời lượng và phản hồi đúng trọng tâm."
              : `Đã xác định ${optionLabel("weakestSkill", answers.weakestSkill)} là kỹ năng cần ưu tiên, giúp cá nhân hóa trọng tâm học và mốc kiểm tra tiến bộ.`,
        },
        {
          angle: "Thời hạn & cường độ học",
          status:
            lowCapacity || timeline === "under-6" || capacity === "unknown"
              ? "Cần điều chỉnh"
              : "Phù hợp",
          explanation: lowCapacity
            ? "Quỹ học dưới 2 giờ/tuần khó đáp ứng mục tiêu tăng band; cần tăng thời lượng, kéo dài thời hạn hoặc điều chỉnh band đích."
            : timeline === "under-6"
              ? `Thời hạn dưới 6 tháng cần được kiểm tra chặt theo khoảng cách từ ${optionLabel("ieltsCurrent", answers.ieltsCurrent)} đến ${optionLabel("ieltsTarget", answers.ieltsTarget)} trước khi cam kết.`
              : capacity === "unknown"
                ? "Chưa có quỹ thời gian học ổn định nên chưa thể kết luận tính khả thi của tiến độ."
                : `Thời hạn ${optionLabel("timeline", timeline).toLowerCase()} cùng quỹ học ${optionLabel("capacity", capacity).toLowerCase()} tạo nền tảng khả thi để thiết kế lộ trình theo chặng.`,
        },
      ],
      missing: ieltsMissing,
      actions: [
        "Thực hiện hoặc xác minh bài đánh giá đầu vào theo 4 kỹ năng.",
        "Đối chiếu khoảng cách band với thời hạn và số giờ học thực tế.",
        lowCapacity
          ? "Không cam kết tăng band nhanh khi thời lượng dưới 2 giờ/tuần; cần điều chỉnh mục tiêu hoặc thời gian."
          : "Xếp chặng học và đặt mốc kiểm tra tiến bộ theo từng kỹ năng.",
      ],
    };
  }

  if (age === "12" && goal === "cambridge") {
    if (!isSpeakWellLevel(level) && !levelUnknown) {
      return noMatch(
        "Không phù hợp theo trình độ",
        "Học sinh 12 tuổi còn trong điều kiện tuổi SpeakWell, nhưng trình độ khai báo đã vượt Flyers/A2.",
        [
          "Không lựa chọn SpeakWell chỉ vì còn đúng tuổi.",
          "Cần xác định lại mục tiêu sau YLE và năng lực thực tế.",
        ],
        [
          "Đánh giá đầu vào và làm rõ mục tiêu General English hay IELTS.",
          "Cân nhắc Easy PASS hoặc Easy IELTS theo kết quả đánh giá và nhu cầu thực.",
        ],
      );
    }
    return {
      product: "SpeakWell",
      verdict: "Đề xuất có điều kiện",
      tone: "green",
      confidence,
      summary:
        "Học sinh 12 tuổi vẫn thuộc độ tuổi SpeakWell và đang theo mục tiêu Cambridge; đây là điểm chuyển tiếp cần xác định kỹ cấp độ đích.",
      eligibility: [
        "Đạt điều kiện tuổi tối đa của SpeakWell: 12 tuổi.",
        `Trình độ khai báo: ${optionLabel("level", level)}.`,
        `Cấp độ Cambridge mục tiêu: ${optionLabel("cambridgeTarget", answers.cambridgeTarget)}.`,
      ],
      rationale: [
        "Mục tiêu Cambridge YLE phù hợp với lộ trình Beginners-Flyers/A2.",
        "Tuổi 12 là giao điểm giữa SpeakWell và Easy PASS nên mục tiêu, không chỉ tuổi, quyết định hướng đi.",
      ],
      fitAnalysis: [
        {
          angle: "Độ tuổi",
          status: "Cần xác minh",
          explanation:
            "Con vẫn nằm trong giới hạn SpeakWell nhưng đã ở mốc 12 tuổi, là điểm chuyển tiếp sang chương trình Teens; cần cân nhắc cả thời gian hoàn thành chặng YLE.",
        },
        {
          angle: "Nền tảng hiện tại",
          status:
            levelUnknown || lowEvidence ? "Cần xác minh" : "Phù hợp",
          explanation:
            levelUnknown || lowEvidence
              ? "Cần đánh giá đầu vào để chắc chắn con còn nằm trong lộ trình Beginners-Flyers/A2."
              : `Mức ${optionLabel("level", level)} vẫn nằm trong phạm vi năng lực SpeakWell phục vụ.`,
        },
        {
          angle: "Mục tiêu chứng chỉ",
          status: "Phù hợp",
          explanation: `Gia đình đang hướng tới ${optionLabel("cambridgeTarget", answers.cambridgeTarget)}, phù hợp trực tiếp với lộ trình Cambridge YLE của SpeakWell.`,
        },
        {
          angle: "Khả năng hoàn thành lộ trình",
          status:
            lowCapacity || timeline === "under-6" || capacity === "unknown"
              ? "Cần điều chỉnh"
              : "Phù hợp",
          explanation:
            "Cần đối chiếu cấp độ hiện tại, cấp độ đích, thời hạn và quỹ học để tránh chọn SpeakWell khi con sắp cần chuyển sang General English hoặc IELTS.",
        },
        {
          angle: "Hướng chuyển tiếp",
          status: "Cần xác minh",
          explanation:
            "Gia đình cần thống nhất trước hướng đi sau Flyers/A2: Easy PASS nếu ưu tiên General English, hoặc Easy IELTS khi đã có mục tiêu band và thời hạn rõ.",
        },
      ],
      missing: commonMissing,
      actions: [
        "Đánh giá đầu vào và kiểm tra tính khả thi của cấp độ Cambridge mục tiêu.",
        "Thống nhất trước hướng chuyển tiếp sau Flyers/A2: General English hay IELTS.",
      ],
    };
  }

  if (goal === "general" || goal === "communication") {
    if (level === "b2-plus") {
      return noMatch(
        "Cần đánh giá ngoài khung",
        "Easy PASS phát triển theo lộ trình A1-B2; học sinh khai báo B2 trở lên nên cần kiểm chứng nhu cầu và khoảng trống năng lực trước.",
        [
          "Không nên xếp vào Easy PASS chỉ dựa trên mục tiêu General English.",
          "Trình độ trên B2 có thể cần chương trình chuyên sâu hoặc mục tiêu khác.",
        ],
        [
          "Đánh giá đủ 4 kỹ năng và xác định điểm nghẽn cụ thể.",
          "Chuyển AS nếu kết quả xác nhận vượt khung B2.",
        ],
      );
    }
    return {
      product: "Easy PASS",
      verdict: lowEvidence || levelUnknown ? "Đề xuất có điều kiện" : "Phù hợp sơ bộ",
      tone: "blue",
      confidence,
      summary:
        "Học sinh 12-18 tuổi, mục tiêu là General English hoặc giao tiếp và trình độ nằm trong lộ trình A1-B2.",
      eligibility: [
        "Đạt điều kiện tuổi của Easy PASS: 12-18 tuổi.",
        `Trình độ khai báo: ${optionLabel("level", level)}.`,
        `Mục tiêu: ${optionLabel("goal", goal)}.`,
      ],
      rationale: [
        "Easy PASS phát triển đồng đều 4 kỹ năng và tạo cầu nối từ A1 đến B2 cho tuổi Teens.",
        `Khả năng duy trì: ${optionLabel("capacity", capacity)}.`,
      ],
      fitAnalysis: [
        {
          angle: "Độ tuổi & bối cảnh học tập",
          status: "Phù hợp",
          explanation:
            "Học sinh 12-18 tuổi, đúng nhóm Teens mà Easy PASS thiết kế để hỗ trợ tiếng Anh trên trường, giao tiếp và năng lực hội nhập.",
        },
        {
          angle: "Nền tảng hiện tại",
          status:
            levelUnknown || lowEvidence ? "Cần xác minh" : "Phù hợp",
          explanation:
            levelUnknown || lowEvidence
              ? "Cần đánh giá đầu vào để xác định đúng chặng A1-B2 và tránh xếp lớp theo cảm nhận."
              : `Trình độ ${optionLabel("level", level)} nằm trong lộ trình A1-B2 của Easy PASS.`,
        },
        {
          angle: "Mục tiêu học tập",
          status: "Phù hợp",
          explanation:
            goal === "communication"
              ? "Gia đình ưu tiên giao tiếp và phản xạ; Easy PASS phát triển năng lực sử dụng tiếng Anh trong tình huống thực tế thay vì tập trung vào một bài thi."
              : "Gia đình ưu tiên tiếng Anh tổng quát và việc học trên trường; Easy PASS phát triển đồng đều Nghe, Nói, Đọc, Viết theo CEFR.",
        },
        {
          angle: "Vai trò trong lộ trình dài hạn",
          status: "Phù hợp",
          explanation:
            "Chương trình tạo cầu nối từ nền tảng YLE sang năng lực Teens A1-B2, giúp học sinh xây nền vững trước khi lựa chọn IELTS hoặc mục tiêu học thuật khác.",
        },
        {
          angle: "Thời hạn & khả năng duy trì",
          status:
            lowCapacity || capacity === "unknown"
              ? "Cần điều chỉnh"
              : "Phù hợp",
          explanation: lowCapacity
            ? "Quỹ học dưới 2 giờ/tuần cần đi kèm mục tiêu hẹp hơn hoặc thời hạn dài hơn để bảo đảm tiến bộ thực chất."
            : capacity === "unknown"
              ? "Cần chốt quỹ thời gian học và tự luyện trước khi đưa ra cam kết tiến độ."
              : `Quỹ học ${optionLabel("capacity", capacity).toLowerCase()} phù hợp để duy trì lộ trình; thời hạn ${optionLabel("timeline", timeline).toLowerCase()}.`,
        },
      ],
      missing: commonMissing,
      actions: [
        "Đánh giá CEFR và xác định kỹ năng nghẽn trước khi xếp lớp.",
        "Chọn 1:1 hoặc lớp nhóm theo nhu cầu hỗ trợ và khả năng học độc lập.",
        lowCapacity
          ? "Thu hẹp mục tiêu hoặc kéo dài thời gian vì quỹ học dưới 2 giờ/tuần."
          : "Thống nhất chỉ báo tiến bộ cho 8-12 tuần đầu.",
      ],
    };
  }

  return noMatch(
    "Cần tư vấn sâu hơn",
    "Dữ liệu hiện tại chưa tạo thành một lộ trình sản phẩm nhất quán.",
    ["Tuổi, trình độ và mục tiêu cần được đọc đồng thời theo nguyên tắc điều kiện trước, sản phẩm sau."],
    ["Chuyển AS để rà lại hồ sơ và thực hiện đánh giá đầu vào."],
  );
}

function Brand() {
  return (
    <div className="brand-mark" aria-label="GE English Advisor">
      <img
        src="/galaxy-education.png"
        alt="Galaxy Education"
        className="ge-logo"
      />
      <span className="brand-divider" />
      <span className="brand-title">
        <strong>English</strong>
        <span>Advisor</span>
      </span>
    </div>
  );
}

function LevelExplorer({
  levels,
  tone,
}: {
  levels: JourneyLevel[];
  tone: Tone;
}) {
  const [active, setActive] = useState(levels[0]);
  return (
    <div className={`level-explorer ${tone}`}>
      <div className="level-pills" role="tablist" aria-label="Chọn trình độ">
        {levels.map((level) => (
          <button
            type="button"
            role="tab"
            aria-selected={active.id === level.id}
            className={active.id === level.id ? "active" : ""}
            onClick={() => setActive(level)}
            key={level.id}
          >
            <strong>{level.label}</strong>
            <small>{level.sub}</small>
          </button>
        ))}
      </div>
      <article className="level-detail" key={active.id}>
        <div>
          <span className="detail-label">Đặc điểm học sinh</span>
          <p>{active.profile}</p>
        </div>
        <div>
          <span className="detail-label">Năng lực có thể kỳ vọng</span>
          <p>{active.canDo}</p>
        </div>
        <div className="counsel-point">
          <span className="detail-label">Điểm nhấn khi tư vấn</span>
          <p>{active.counsel}</p>
        </div>
      </article>
    </div>
  );
}

function Pathway() {
  const [stage, setStage] = useState<"yle" | "general" | "ielts">("yle");
  const current =
    stage === "yle"
      ? { levels: yleLevels, tone: "green" as Tone }
      : stage === "general"
        ? { levels: generalLevels, tone: "blue" as Tone }
        : { levels: ieltsLevels, tone: "pink" as Tone };

  return (
    <section className="content-section pathway-section" id="pathway">
      <div className="section-shell">
        <div className="section-heading split-heading reveal">
          <div>
            <span className="section-kicker">Bản đồ năng lực tương tác</span>
            <h2>Một hành trình, nhìn rõ từng chặng phát triển</h2>
          </div>
          <p>
            Chọn từng chặng và trình độ để xem đặc điểm học sinh, năng lực có
            thể kỳ vọng và luận điểm Đại sứ nên sử dụng.
          </p>
        </div>

        <div className="animated-route reveal" aria-label="Bản đồ lộ trình">
          <div className="route-line">
            <span />
          </div>
          {[
            {
              id: "yle",
              no: "01",
              label: "Cambridge YLE",
              title: "Xây nền tảng",
              sub: "Beginners → A2 Flyers",
              product: "SpeakWell · 7-12 tuổi",
              logo: "/speakwell-logo.png",
              logoAlt: "SpeakWell",
            },
            {
              id: "general",
              no: "02",
              label: "General English",
              title: "Phát triển toàn diện",
              sub: "A1 → B2",
              product: "Easy PASS · 12-18 tuổi",
              logo: "/easy-pass-logo.png",
              logoAlt: "Easy PASS",
            },
            {
              id: "ielts",
              no: "03",
              label: "IELTS & đại học",
              title: "Học theo mục tiêu",
              sub: "2.0 → 7.0+",
              product: "Easy IELTS · từ 12 tuổi",
              logo: "/easy-ielts-logo.png",
              logoAlt: "Easy IELTS",
            },
          ].map((item, index) => (
            <button
              type="button"
              key={item.id}
              className={`route-stage ${item.id} ${stage === item.id ? "active" : ""}`}
              onClick={() => setStage(item.id as typeof stage)}
              style={{ animationDelay: `${index * 140}ms` }}
            >
              <span className="route-node">{item.no}</span>
              <small>{item.label}</small>
              <strong>{item.title}</strong>
              <p>{item.sub}</p>
              <span className="route-product">
                <span className="route-logo-frame">
                  <img src={item.logo} alt={item.logoAlt} />
                </span>
                <em>{item.product}</em>
              </span>
            </button>
          ))}
        </div>

        <div className="stage-explainer reveal">
          <div className="explainer-head">
            <span>
              {stage === "yle"
                ? "Cambridge Young Learners"
                : stage === "general"
                  ? "Khung CEFR"
                  : "Lộ trình Easy IELTS"}
            </span>
            <strong>Nhấn vào từng trình độ để xem hồ sơ tư vấn</strong>
          </div>
          <LevelExplorer levels={current.levels} tone={current.tone} />
        </div>

        <div className="transition-callout reveal">
          <span className="callout-icon">💡</span>
          <div>
            <strong>Điểm chuyển tiếp cần tư vấn kỹ</strong>
            <p>
              Sau Flyers hoặc ở tuổi 12, không mặc định chuyển thẳng sang IELTS.
              Nếu ưu tiên tiếng Anh tổng quát và học trên trường, cân nhắc Easy
              PASS; nếu đã có nền tảng, band mục tiêu và thời hạn rõ, mới cân
              nhắc Easy IELTS.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Advisor({ onNavigate }: { onNavigate: (view: View) => void }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<AdvisorAnswers>({});
  const [done, setDone] = useState(false);
  const visibleQuestions = useMemo(
    () =>
      advisorQuestions.filter(
        (item) => !item.showWhen || item.showWhen(answers),
      ),
    [answers],
  );
  const question = visibleQuestions[step];

  const recommendation = useMemo(() => {
    if (!done) return null;
    return buildAdvisorRecommendation(answers);
  }, [answers, done]);

  const reset = () => {
    setStep(0);
    setAnswers({});
    setDone(false);
  };

  return (
    <section className="content-section advisor-section" id="advisor">
      <div className="section-shell">
        <div className="section-heading centered-heading reveal">
          <span className="section-kicker">Trợ lý tư vấn nhanh</span>
          <h2>Phân tuyến có điều kiện, không gợi ý theo cảm tính</h2>
          <p>
            Bộ câu hỏi ưu tiên độ tuổi, trình độ, mục tiêu và tính khả thi. Kết
            quả chỉ là định hướng sơ bộ, không thay thế đánh giá đầu vào.
          </p>
        </div>
        <div className="advisor-card reveal">
          {!done ? (
            <>
              <div className="advisor-progress">
                <div className="progress-meta">
                  <span>
                    Câu {step + 1}/{visibleQuestions.length}
                  </span>
                  <strong>
                    {Math.round(((step + 1) / visibleQuestions.length) * 100)}%
                  </strong>
                </div>
                <div className="progress-track">
                  <span
                    style={{
                      width: `${((step + 1) / visibleQuestions.length) * 100}%`,
                    }}
                  />
                </div>
              </div>
              <div className="question-block">
                <h3>{question.title}</h3>
                <p>{question.note}</p>
                <div className="option-grid">
                  {question.options.map(([value, label, note]) => (
                    <button
                      className={`option ${answers[question.key] === value ? "selected" : ""}`}
                      onClick={() =>
                        setAnswers((old) => ({
                          ...old,
                          [question.key]: value,
                        }))
                      }
                      type="button"
                      key={value}
                    >
                      <span className="option-radio" />
                      <span>
                        <strong>{label}</strong>
                        <small>{note}</small>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="advisor-actions">
                <button
                  className="text-button"
                  disabled={step === 0}
                  onClick={() => setStep((n) => n - 1)}
                  type="button"
                >
                  Quay lại
                </button>
                <button
                  className="primary-button"
                  disabled={!answers[question.key]}
                  onClick={() =>
                    step === visibleQuestions.length - 1
                      ? setDone(true)
                      : setStep((n) => n + 1)
                  }
                  type="button"
                >
                  {step === visibleQuestions.length - 1
                    ? "Xem gợi ý"
                    : "Tiếp tục"}{" "}
                  →
                </button>
              </div>
            </>
          ) : (
            recommendation && (
              <div className={`advisor-result ${recommendation.tone}`}>
                <div className="advisor-result-header">
                  <div>
                    <div className="result-kicker">Kết luận tư vấn sơ bộ</div>
                    <h3>{recommendation.product}</h3>
                    <p>{recommendation.summary}</p>
                  </div>
                  <div className="result-status">
                    <span>{recommendation.verdict}</span>
                    <small>Độ tin cậy: {recommendation.confidence}</small>
                  </div>
                </div>

                <div className="advisor-guardrail">
                  <strong>Đã áp dụng điều kiện loại trừ theo tuổi</strong>
                  <span>
                    SpeakWell 7-12 tuổi · Easy PASS 12-18 tuổi · Easy IELTS từ
                    12 tuổi
                  </span>
                </div>

                {recommendation.fitAnalysis.length > 0 && (
                  <section className="fit-analysis">
                    <div className="fit-analysis-heading">
                      <div>
                        <span>Vì sao đề xuất chương trình này?</span>
                        <h4>
                          Mức độ phù hợp được nhìn từ nhiều góc độ, không chỉ từ
                          một mục tiêu đơn lẻ
                        </h4>
                      </div>
                      <p>
                        Các đánh giá dưới đây được tạo từ chính hồ sơ vừa khai
                        báo. “Cần xác minh” hoặc “Cần điều chỉnh” là điều kiện
                        Đại sứ phải xử lý trước khi chốt.
                      </p>
                    </div>
                    <div className="fit-analysis-grid">
                      {recommendation.fitAnalysis.map((item) => (
                        <article
                          className={`fit-item ${
                            item.status === "Phù hợp"
                              ? "fit-good"
                              : item.status === "Cần xác minh"
                                ? "fit-check"
                                : "fit-adjust"
                          }`}
                          key={item.angle}
                        >
                          <div>
                            <strong>{item.angle}</strong>
                            <span>{item.status}</span>
                          </div>
                          <p>{item.explanation}</p>
                        </article>
                      ))}
                    </div>
                  </section>
                )}

                <div className="result-panels">
                  <section className="recommendation-panel">
                    <span className="panel-number">01</span>
                    <div>
                      <strong>Điều kiện đã đối chiếu</strong>
                      <ul>
                        {recommendation.eligibility.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </section>
                  <section className="recommendation-panel">
                    <span className="panel-number">02</span>
                    <div>
                      <strong>Căn cứ của đề xuất</strong>
                      <ul>
                        {recommendation.rationale.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </section>
                  <section
                    className={`recommendation-panel ${recommendation.missing.length ? "warning" : "complete"}`}
                  >
                    <span className="panel-number">03</span>
                    <div>
                      <strong>
                        {recommendation.missing.length
                          ? "Dữ kiện còn thiếu"
                          : recommendation.tone === "neutral"
                            ? "Kết luận về điều kiện"
                          : "Dữ kiện cốt lõi đã đủ"}
                      </strong>
                      {recommendation.missing.length ? (
                        <ul>
                          {recommendation.missing.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      ) : recommendation.tone === "neutral" ? (
                        <p>
                          Dữ liệu hiện có đã đủ để xác định không nên chốt một
                          trong ba sản phẩm. Hãy thực hiện bước làm rõ bên dưới,
                          không chuyển thẳng sang xếp lớp.
                        </p>
                      ) : (
                        <p>
                          Có thể chuyển sang đánh giá đầu vào/xếp lớp để xác
                          minh lần cuối.
                        </p>
                      )}
                    </div>
                  </section>
                  <section className="recommendation-panel next-step">
                    <span className="panel-number">04</span>
                    <div>
                      <strong>Bước tiếp theo cho Đại sứ</strong>
                      <ol>
                        {recommendation.actions.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ol>
                    </div>
                  </section>
                </div>

                <div className="result-actions">
                  <button className="secondary-button" onClick={reset}>
                    Làm lại
                  </button>
                  <button
                    className="primary-button"
                    onClick={() => onNavigate("scripts")}
                  >
                    Lấy kịch bản tư vấn →
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}

function ProductLibrary() {
  const [activeId, setActiveId] = useState(products[0].id);
  const active = products.find((product) => product.id === activeId)!;
  return (
    <section className="content-section products-section" id="products">
      <div className="section-shell">
        <div className="section-heading split-heading reveal">
          <div>
            <span className="section-kicker">Thư viện sản phẩm chuyên sâu</span>
            <h2>Key tư vấn theo nhu cầu, bằng chứng và điểm loại trừ</h2>
          </div>
          <p>
            Mỗi hồ sơ sản phẩm gồm tín hiệu khách hàng, luận điểm nổi bật, câu
            hỏi chẩn đoán và bước chốt phù hợp.
          </p>
        </div>
        <div className="product-switcher reveal" role="tablist">
          {products.map((product) => (
            <button
              type="button"
              role="tab"
              aria-selected={activeId === product.id}
              className={`${product.tone} ${activeId === product.id ? "active" : ""}`}
              onClick={() => setActiveId(product.id)}
              key={product.id}
            >
              <span className="product-tab-logo">
                <img src={product.logo} alt={product.logoAlt} />
              </span>
              <span className="product-tab-copy">
                <small>{product.tag}</small>
                <strong>{product.name}</strong>
              </span>
            </button>
          ))}
        </div>
        <article
          className={`product-dossier ${active.tone} reveal`}
          key={active.id}
        >
          <header>
            <div className="dossier-brand">
              <span className="dossier-logo-frame">
                <img src={active.logo} alt={active.logoAlt} />
              </span>
              <span>{active.tag}</span>
            </div>
            <p>{active.intro}</p>
          </header>
          <div className="dossier-grid">
            <section className="signal-panel">
              <h4>Tín hiệu nên tư vấn</h4>
              <ul>
                {active.signals.map((signal) => (
                  <li key={signal}>✓ {signal}</li>
                ))}
              </ul>
            </section>
            <section className="key-panel">
              <h4>Key nổi bật để giải thích giá trị</h4>
              <div className="key-grid">
                {active.keys.map((key) => (
                  <div key={key.title}>
                    <strong>{key.title}</strong>
                    <p>{key.text}</p>
                  </div>
                ))}
              </div>
            </section>
            <section className="question-panel">
              <h4>Bốn câu cần hỏi trước khi đề xuất</h4>
              <ol>
                {active.questions.map((question) => (
                  <li key={question}>{question}</li>
                ))}
              </ol>
            </section>
            <section className="decision-panel">
              <div className="avoid-box">
                <strong>Không nên ưu tiên khi</strong>
                <p>{active.avoid}</p>
              </div>
              <div className="close-box">
                <strong>Bước chốt học thuật</strong>
                <p>{active.close}</p>
              </div>
            </section>
          </div>
        </article>
        <div className="source-note reveal">
          <span>ⓘ</span>
          <span>
            Học phí, ưu đãi, lịch khai giảng và cấu hình lớp có thể thay đổi.
            Đại sứ cần kiểm tra thông báo vận hành mới nhất trước khi xác nhận
            với phụ huynh.
          </span>
        </div>
      </div>
    </section>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };
  return (
    <button className="copy-button" onClick={copy} type="button">
      {copied ? "✓ Đã sao chép" : "▣ Sao chép"}
    </button>
  );
}

function ScriptLibrary() {
  const groups = [...new Set(scripts.map((script) => script.group))];
  const [mode, setMode] = useState<"scripts" | "objections">("scripts");
  const [group, setGroup] = useState(groups[0]);
  const available = scripts.filter((script) => script.group === group);
  const [title, setTitle] = useState(available[0].title);
  const current =
    scripts.find((script) => script.title === title) ?? available[0];

  const chooseGroup = (next: string) => {
    setGroup(next);
    setTitle(scripts.find((script) => script.group === next)!.title);
  };

  return (
    <section className="content-section scripts-section" id="scripts">
      <div className="section-shell">
        <div className="section-heading centered-heading reveal">
          <span className="section-kicker">Kịch bản dùng ngay</span>
          <h2>Kịch bản tư vấn và xử lý phản đối trong cùng một thư viện</h2>
          <p>
            Nội dung giữ vai trò tư vấn, có căn cứ và tôn trọng quyền quyết định
            của phụ huynh. Hãy cá nhân hóa trước khi gửi.
          </p>
        </div>
        <div className="script-mode-tabs reveal" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={mode === "scripts"}
            className={mode === "scripts" ? "active" : ""}
            onClick={() => setMode("scripts")}
          >
            Kịch bản tư vấn
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "objections"}
            className={mode === "objections" ? "active" : ""}
            onClick={() => setMode("objections")}
          >
            Xử lý phản đối
          </button>
        </div>
        {mode === "scripts" ? (
          <div className="script-library reveal">
          <div className="script-groups" role="tablist">
            {groups.map((item) => (
              <button
                type="button"
                role="tab"
                aria-selected={group === item}
                className={group === item ? "active" : ""}
                onClick={() => chooseGroup(item)}
                key={item}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="script-layout">
            <div className="script-list">
              {available.map((script) => (
                <button
                  type="button"
                  className={current.title === script.title ? "active" : ""}
                  onClick={() => setTitle(script.title)}
                  key={script.title}
                >
                  <span>{script.title}</span>
                  <em>→</em>
                </button>
              ))}
            </div>
            <article className="script-preview" key={current.title}>
              <div className="script-preview-top">
                <div className="zalo-avatar">GE</div>
                <div>
                  <small>Kịch bản đề xuất</small>
                  <h3>{current.title}</h3>
                </div>
              </div>
              <div className="message-bubble">{current.text}</div>
              <div className="script-preview-footer">
                <span>ⓘ Cá nhân hóa tên, trình độ và mục tiêu trước khi gửi</span>
                <CopyButton text={current.text} />
              </div>
            </article>
          </div>
          </div>
        ) : (
          <ObjectionPanel />
        )}
      </div>
    </section>
  );
}

function ObjectionPanel() {
  const [query, setQuery] = useState("");
  const filtered = objections.filter((item) =>
    `${item.q} ${item.answer}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <div className="objection-panel">
        <div className="objection-header reveal">
          <div className="faq-intro">
            <span className="section-kicker">Xử lý phản đối</span>
            <h2>Khéo léo trong cách nói, chặt chẽ trong lập luận</h2>
            <p>
              Không phủ nhận lo lắng của phụ huynh. Ghi nhận, làm rõ dữ liệu,
              giải thích bằng logic học tập và đề xuất một bước tiếp theo có
              mức cam kết thấp.
            </p>
            <div className="faq-principle">
              <span>💡</span>
              <span>
                <strong>Ghi nhận → Làm rõ → Giải thích → Đề xuất</strong>
              </span>
            </div>
          </div>
          <label className="objection-search">
            <span>Tìm nhanh tình huống</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Ví dụ: học phí, IELTS sớm, mất gốc..."
            />
          </label>
        </div>
        <div className="faq-list objection-grid reveal">
          {filtered.map((item, index) => (
            <details open={index === 0 && !query} key={item.q}>
              <summary>
                <span>{item.q}</span>
                <span className="faq-plus">+</span>
              </summary>
              <div className="objection-answer">
                <p>{item.answer}</p>
                <div>
                  <strong>Bước nối tiếp:</strong> {item.next}
                </div>
                <CopyButton text={`${item.answer}\n\n${item.next}`} />
              </div>
            </details>
          ))}
          {filtered.length === 0 && (
            <div className="empty-state">
              Chưa có tình huống khớp. Thử từ khóa khác như “online”, “band”,
              “học phí” hoặc “12 tuổi”.
            </div>
          )}
        </div>
    </div>
  );
}

function ExamOverview() {
  const [exam, setExam] = useState<"ielts" | "yle">("ielts");

  return (
    <section className="content-section exams-section" id="exams">
      <div className="section-shell">
        <div className="section-heading centered-heading reveal">
          <span className="section-kicker">Kiến thức nền dành cho Đại sứ</span>
          <h2>Tổng quan các Kỳ thi</h2>
          <p>
            Hiểu đúng mục đích, cấu trúc và cách đọc kết quả trước khi tư vấn
            lộ trình học. Thông tin được đối chiếu với nguồn chính thức của
            IELTS và Cambridge English.
          </p>
        </div>

        <div className="exam-switcher reveal" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={exam === "ielts"}
            className={exam === "ielts" ? "active ielts" : ""}
            onClick={() => setExam("ielts")}
          >
            <span>IELTS</span>
            <small>Học thuật · Đại học · Du học · Nghề nghiệp</small>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={exam === "yle"}
            className={exam === "yle" ? "active yle" : ""}
            onClick={() => setExam("yle")}
          >
            <span>YLE Cambridge</span>
            <small>Pre A1 Starters · A1 Movers · A2 Flyers</small>
          </button>
        </div>

        {exam === "ielts" ? (
          <article className="exam-dossier ielts reveal" key="ielts">
            <header className="exam-hero">
              <div>
                <span className="exam-label">International English Language Testing System</span>
                <h3>IELTS đánh giá khả năng sử dụng tiếng Anh trong học tập, công việc và hội nhập</h3>
                <p>
                  Bài thi đánh giá độc lập bốn kỹ năng Nghe, Đọc, Viết và Nói.
                  Kết quả không chỉ có điểm Overall mà còn có band riêng cho
                  từng kỹ năng, vì vậy cần đọc cả hồ sơ điểm thay vì chỉ nhìn
                  một con số tổng.
                </p>
              </div>
              <div className="exam-fact-stack">
                <div><strong>4</strong><span>kỹ năng</span></div>
                <div><strong>0–9</strong><span>thang band</span></div>
                <div><strong>2h45</strong><span>IELTS Academic</span></div>
              </div>
            </header>

            <div className="exam-section-grid">
              <section className="exam-card">
                <span className="card-number">01</span>
                <h4>Các loại bài thi</h4>
                <div className="exam-comparison">
                  <div>
                    <strong>IELTS Academic</strong>
                    <p>
                      Phù hợp với mục tiêu đại học, sau đại học và một số yêu
                      cầu đăng ký hành nghề. Nội dung Reading và Writing mang
                      tính học thuật cao hơn.
                    </p>
                  </div>
                  <div>
                    <strong>IELTS General Training</strong>
                    <p>
                      Phù hợp với mục tiêu di trú, đào tạo hoặc học dưới bậc
                      đại học và các bối cảnh xã hội, công việc thường ngày.
                    </p>
                  </div>
                </div>
                <p className="exam-note">
                  Listening và Speaking giống nhau ở hai loại; Reading và
                  Writing khác nhau. Luôn kiểm tra yêu cầu của trường, chương
                  trình hoặc quốc gia trước khi chọn bài thi.
                </p>
              </section>

              <section className="exam-card">
                <span className="card-number">02</span>
                <h4>Cấu trúc IELTS Academic</h4>
                <div className="skill-table">
                  <div><strong>Listening</strong><span>Khoảng 30 phút</span><small>40 câu hỏi · nghe hiểu ý chính, chi tiết và thái độ người nói</small></div>
                  <div><strong>Reading</strong><span>60 phút</span><small>40 câu hỏi · đọc hiểu, xác định luận điểm và xử lý văn bản học thuật</small></div>
                  <div><strong>Writing</strong><span>60 phút</span><small>2 tasks · mô tả thông tin trực quan và viết bài nghị luận</small></div>
                  <div><strong>Speaking</strong><span>11–14 phút</span><small>3 phần · phỏng vấn trực tiếp, trình bày và thảo luận</small></div>
                </div>
              </section>

              <section className="exam-card">
                <span className="card-number">03</span>
                <h4>Cách tính và đọc điểm</h4>
                <p>
                  Mỗi kỹ năng nhận band từ 0 đến 9 theo bước 0.5. Overall là
                  trung bình của bốn kỹ năng và được làm tròn theo quy tắc
                  IELTS. Một Overall giống nhau có thể che giấu hồ sơ kỹ năng
                  rất khác nhau.
                </p>
                <div className="band-grid">
                  <div><strong>4.0</strong><span>Limited user</span></div>
                  <div><strong>5.0</strong><span>Modest user</span></div>
                  <div><strong>6.0</strong><span>Competent user</span></div>
                  <div><strong>7.0</strong><span>Good user</span></div>
                  <div><strong>8.0</strong><span>Very good user</span></div>
                  <div><strong>9.0</strong><span>Expert user</span></div>
                </div>
                <p className="exam-note">
                  IELTS khuyến nghị kết quả được xem là thể hiện năng lực trong
                  tối đa hai năm; tổ chức tiếp nhận có thể đặt quy định riêng.
                </p>
              </section>

              <section className="exam-card">
                <span className="card-number">04</span>
                <h4>Giá trị dài hạn ngoài xét tuyển</h4>
                <ul className="exam-value-list">
                  <li><strong>Tư duy học thuật:</strong> đọc luận điểm, chọn bằng chứng, tổ chức ý và lập luận có căn cứ.</li>
                  <li><strong>Sẵn sàng cho đại học:</strong> tiếp cận tài liệu, nghe giảng, viết bài và thuyết trình bằng tiếng Anh.</li>
                  <li><strong>Du học và hội nhập:</strong> chứng minh năng lực theo yêu cầu của nhiều chương trình quốc tế.</li>
                  <li><strong>Nghề nghiệp tương lai:</strong> tạo nền để đọc tài liệu chuyên môn và giao tiếp trong môi trường đa quốc gia.</li>
                </ul>
              </section>
            </div>

            <section className="exam-advisor-box">
              <div>
                <span>Góc nhìn tư vấn</span>
                <h4>Khi nào nên hướng học sinh sang IELTS?</h4>
              </div>
              <div className="advisor-criteria">
                <p><strong>Đủ điều kiện:</strong> từ 12 tuổi, có mục tiêu sử dụng tương đối rõ, sẵn sàng đánh giá đầu vào và duy trì học tập.</p>
                <p><strong>Chưa nên chốt:</strong> chỉ học vì xu hướng, chưa rõ thời điểm dùng chứng chỉ hoặc nền tảng còn cần được củng cố.</p>
                <p><strong>Liên hệ sản phẩm:</strong> Easy IELTS phù hợp khi có thể xác định band hiện tại, band mục tiêu, thời hạn và kỹ năng nghẽn.</p>
              </div>
            </section>

            <div className="official-sources">
              <strong>Nguồn chính thức:</strong>
              <a href="https://ielts.org/take-a-test/test-types" target="_blank" rel="noreferrer">Các loại IELTS</a>
              <a href="https://ielts.org/take-a-test/test-types/ielts-academic-test" target="_blank" rel="noreferrer">Cấu trúc IELTS Academic</a>
              <a href="https://ielts.org/take-a-test/your-results/ielts-scoring-in-detail" target="_blank" rel="noreferrer">Thang điểm IELTS</a>
            </div>
          </article>
        ) : (
          <article className="exam-dossier yle reveal" key="yle">
            <header className="exam-hero">
              <div>
                <span className="exam-label">Cambridge English Qualifications for Young Learners</span>
                <h3>YLE là lộ trình đánh giá tiếng Anh dành cho trẻ em từ Pre A1 đến A2</h3>
                <p>
                  Ba kỳ thi Pre A1 Starters, A1 Movers và A2 Flyers đo khả năng
                  sử dụng tiếng Anh trong các chủ đề quen thuộc. Thiết kế bài
                  thi hướng tới trải nghiệm tích cực, giúp trẻ nhận ra tiến bộ
                  và xây sự tự tin thay vì tạo tâm lý đỗ hoặc trượt.
                </p>
              </div>
              <div className="exam-fact-stack">
                <div><strong>3</strong><span>cấp độ</span></div>
                <div><strong>3</strong><span>bài thi kỹ năng</span></div>
                <div><strong>15</strong><span>shields tối đa</span></div>
              </div>
            </header>

            <section className="yle-levels">
              <article>
                <span>01 · Pre A1</span>
                <h4>Starters</h4>
                <p>
                  Cột mốc đầu tiên: trẻ hiểu chỉ dẫn, câu hỏi và mô tả rất đơn
                  giản; gọi tên người, đồ vật; viết từ hoặc câu ngắn và trả lời
                  về thông tin quen thuộc.
                </p>
                <small>Khoảng 45 phút · Listening 20&apos; · Reading & Writing 20&apos; · Speaking 3–5&apos;</small>
              </article>
              <article>
                <span>02 · A1</span>
                <h4>Movers</h4>
                <p>
                  Trẻ bắt đầu giao tiếp trong tình huống đời sống quen thuộc,
                  mô tả người và sự việc, đọc hiểu văn bản ngắn và viết các câu
                  có kết nối ở mức cơ bản.
                </p>
                <small>Khoảng 1 giờ · Listening 25&apos; · Reading & Writing 30&apos; · Speaking 5–7&apos;</small>
              </article>
              <article>
                <span>03 · A2</span>
                <h4>Flyers</h4>
                <p>
                  Trẻ sử dụng tiếng Anh độc lập hơn, theo dõi hội thoại ngắn,
                  đọc văn bản đơn giản, kể hoặc mô tả có trình tự và viết đoạn
                  có liên kết.
                </p>
                <small>Khoảng 1 giờ 15 phút · Listening 25&apos; · Reading & Writing 40&apos; · Speaking 7–9&apos;</small>
              </article>
            </section>

            <div className="exam-section-grid">
              <section className="exam-card">
                <span className="card-number">01</span>
                <h4>Cấu trúc chung</h4>
                <div className="skill-table yle-table">
                  <div><strong>Listening</strong><span>Tối đa 5 shields</span><small>Nghe hai lần; xử lý hình ảnh, từ khóa, chỉ dẫn và hội thoại phù hợp cấp độ</small></div>
                  <div><strong>Reading & Writing</strong><span>Tối đa 5 shields</span><small>Đọc hiểu và tạo lập ngôn ngữ từ mức từ/câu đến văn bản ngắn</small></div>
                  <div><strong>Speaking</strong><span>Tối đa 5 shields</span><small>Tương tác trực tiếp với giám khảo qua tranh, câu hỏi và nhiệm vụ giao tiếp</small></div>
                </div>
              </section>

              <section className="exam-card">
                <span className="card-number">02</span>
                <h4>Đọc kết quả bằng Shields</h4>
                <p>
                  YLE không có kết quả đỗ hoặc trượt. Mọi trẻ hoàn thành bài thi
                  đều nhận chứng chỉ và Statement of Results. Mỗi phần thi được
                  thể hiện từ 1 đến 5 shields.
                </p>
                <div className="shield-scale" aria-label="Thang kết quả YLE">
                  <span>1 shield</span>
                  <i>●</i><i>●</i><i>●</i><i>●</i><i>●</i>
                  <span>5 shields</span>
                </div>
                <p className="exam-note">
                  Cambridge cho biết trẻ đạt 4 hoặc 5 shields ở mỗi kỹ năng đã
                  sẵn sàng bắt đầu chuẩn bị cho cấp độ tiếp theo. Không nên chỉ
                  cộng tổng shields mà bỏ qua kỹ năng còn yếu.
                </p>
              </section>

              <section className="exam-card">
                <span className="card-number">03</span>
                <h4>Giá trị của YLE</h4>
                <ul className="exam-value-list">
                  <li><strong>Cột mốc vừa sức:</strong> chia hành trình dài thành các bước trẻ có thể đạt được.</li>
                  <li><strong>Năng lực thực chất:</strong> phát triển đồng thời nghe, nói, đọc và viết trong bối cảnh quen thuộc.</li>
                  <li><strong>Sự tự tin:</strong> ghi nhận thành quả mà không tạo áp lực đỗ hoặc trượt.</li>
                  <li><strong>Nền tảng chuyển tiếp:</strong> A2 Flyers tạo nền để phát triển General English B1–B2 trước khi học thuật hóa.</li>
                </ul>
              </section>

              <section className="exam-card">
                <span className="card-number">04</span>
                <h4>Những hiểu lầm cần tránh</h4>
                <ul className="exam-value-list warning-list">
                  <li>Không xếp cấp độ chỉ dựa trên tuổi hoặc lớp đang học.</li>
                  <li>Không biến YLE thành chuỗi luyện đề và học thuộc từ vựng.</li>
                  <li>Không mặc định học xong Flyers phải chuyển ngay sang IELTS.</li>
                  <li>Không dùng tổng shields để che khuất một kỹ năng đang cần củng cố.</li>
                </ul>
              </section>
            </div>

            <section className="exam-advisor-box">
              <div>
                <span>Góc nhìn tư vấn</span>
                <h4>YLE phù hợp với học sinh nào?</h4>
              </div>
              <div className="advisor-criteria">
                <p><strong>Đúng đối tượng:</strong> kỳ thi được thiết kế cho trẻ khoảng 6–12 tuổi; SpeakWell hiện phục vụ học sinh 7–12 tuổi.</p>
                <p><strong>Đúng mục tiêu:</strong> xây nền bốn kỹ năng, tạo sự tự tin và có cột mốc Cambridge rõ ràng.</p>
                <p><strong>Liên hệ sản phẩm:</strong> SpeakWell đi theo lộ trình Beginners → Starters → Movers → Flyers; cần đánh giá đầu vào để chọn đúng chặng.</p>
              </div>
            </section>

            <div className="official-sources">
              <strong>Nguồn chính thức:</strong>
              <a href="https://www.cambridgeenglish.org/exams-and-tests/qualifications/young-learners/" target="_blank" rel="noreferrer">Tổng quan Young Learners</a>
              <a href="https://www.cambridgeenglish.org/exams-and-tests/qualifications/results/young-learners/" target="_blank" rel="noreferrer">Kết quả và Shields</a>
              <a href="https://www.cambridgeenglish.org/exams-and-tests/qualifications/young-learners/paper/flyers/format/" target="_blank" rel="noreferrer">Cấu trúc A2 Flyers</a>
            </div>
          </article>
        )}
      </div>
    </section>
  );
}

export default function Page() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeView, setActiveView] = useState<View>("home");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("is-visible");
        });
      },
      { threshold: 0.12 },
    );
    document
      .querySelectorAll(".reveal")
      .forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [activeView]);

  useEffect(() => {
    const readView = () => {
      const hash = window.location.hash.replace("#", "");
      const candidate = (hash === "faq" ? "scripts" : hash) as View;
      const views: View[] = [
        "home",
        "pathway",
        "advisor",
        "products",
        "scripts",
        "exams",
      ];
      setActiveView(views.includes(candidate) ? candidate : "home");
    };
    readView();
    window.addEventListener("hashchange", readView);
    return () => window.removeEventListener("hashchange", readView);
  }, []);

  const go = (view: View) => {
    setMenuOpen(false);
    setActiveView(view);
    const nextHash = view === "home" ? window.location.pathname : `#${view}`;
    window.history.pushState(null, "", nextHash);
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  return (
    <main>
      <header className="site-header">
        <div className="header-inner">
          <button
            className="brand-button"
            type="button"
            aria-label="Về đầu trang"
            onClick={() => go("home")}
          >
            <Brand />
          </button>
          <nav
            className={`desktop-nav ${menuOpen ? "mobile-open" : ""}`}
            aria-label="Điều hướng chính"
          >
            {[
              ["pathway", "Bản đồ lộ trình"],
              ["advisor", "Gợi ý tư vấn"],
              ["products", "Sản phẩm"],
              ["scripts", "Kịch bản"],
              ["exams", "Tổng quan các Kỳ thi"],
            ].map(([id, label]) => (
              <button
                className={activeView === id ? "active" : ""}
                aria-current={activeView === id ? "page" : undefined}
                onClick={() => go(id as View)}
                type="button"
                key={id}
              >
                {label}
              </button>
            ))}
          </nav>
          <button
            className="header-cta"
            type="button"
            onClick={() => go("advisor")}
          >
            Bắt đầu tư vấn →
          </button>
          <button
            className="menu-button"
            type="button"
            aria-label="Mở menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            ☰
          </button>
        </div>
      </header>

      {activeView === "home" && (
        <>
      <section className="hero" id="top">
        <div className="hero-pattern" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
          <i />
          <i />
        </div>
        <div className="section-shell hero-grid">
          <div className="hero-copy">
            <div className="eyebrow">
              ✦ Sổ tay tư vấn thông minh dành cho Đại sứ
            </div>
            <h1>
              Từ nhu cầu của học sinh đến{" "}
              <span>lộ trình tiếng Anh phù hợp</span>
            </h1>
            <p>
              Hỏi đúng, chọn đúng hướng và giải thích dễ hiểu với bản đồ
              Cambridge YLE → General English → IELTS cùng logic tư vấn nhất
              quán.
            </p>
            <div className="hero-actions">
              <button
                className="primary-button"
                onClick={() => go("advisor")}
                type="button"
              >
                ◉ Gợi ý hướng tư vấn
              </button>
              <button
                className="secondary-button"
                onClick={() => go("pathway")}
                type="button"
              >
                Xem bản đồ lộ trình →
              </button>
            </div>
            <div className="hero-note">
              ⓘ Công cụ đưa ra định hướng ban đầu, không thay thế kết quả đánh
              giá đầu vào.
            </div>
          </div>
          <div className="hero-panel">
            <div className="panel-topline">
              <div>
                <span>Tra cứu nhanh</span>
                <strong>Học sinh đang ở chặng nào?</strong>
              </div>
              <div className="live-pill">
                <span /> Sẵn sàng
              </div>
            </div>
            <div className="mini-path">
              <article className="mini-card green">
                <span className="mini-product-logo">
                  <img src="/speakwell-logo.png" alt="SpeakWell" />
                </span>
                <div>
                  <small>7-12 tuổi</small>
                  <strong>Cambridge YLE</strong>
                  <p>Beginners → Flyers</p>
                </div>
              </article>
              <div className="path-connector">→</div>
              <article className="mini-card blue">
                <span className="mini-product-logo">
                  <img src="/easy-pass-logo.png" alt="Easy PASS" />
                </span>
                <div>
                  <small>12-18 tuổi</small>
                  <strong>General English</strong>
                  <p>A1 → B2</p>
                </div>
              </article>
              <div className="path-connector">→</div>
              <article className="mini-card pink">
                <span className="mini-product-logo">
                  <img src="/easy-ielts-logo.png" alt="Easy IELTS" />
                </span>
                <div>
                  <small>Từ 12 tuổi</small>
                  <strong>IELTS</strong>
                  <p>2.0 → 7.0+</p>
                </div>
              </article>
            </div>
            <button
              className="panel-action"
              onClick={() => go("advisor")}
              type="button"
            >
              Nhập hồ sơ học sinh →
            </button>
          </div>
        </div>
      </section>

      <section className="quick-section">
        <div className="section-shell">
          <div className="quick-grid">
            {[
              ["green", "pathway", "↝", "Xem lộ trình", "Khám phá từng trình độ và đặc điểm học sinh."],
              ["pink", "advisor", "◉", "Gợi ý tư vấn", "Phân tuyến có điều kiện trong 2-3 phút."],
              ["blue", "products", "⌕", "Tra cứu sản phẩm", "Lấy key tư vấn, câu hỏi và điểm loại trừ."],
              ["yellow", "scripts", "☵", "Kịch bản & phản đối", "Tra cứu nội dung tư vấn và cách xử lý tình huống."],
            ].map(([color, id, icon, title, text]) => (
              <button
                className={`quick-card ${color}`}
                onClick={() => go(id as View)}
                type="button"
                key={id}
              >
                <span className="quick-icon">{icon}</span>
                <span>
                  <strong>{title}</strong>
                  <small>{text}</small>
                </span>
                <span className="quick-arrow">›</span>
              </button>
            ))}
          </div>
        </div>
      </section>
        </>
      )}

      <div className="view-shell" key={activeView}>
        {activeView === "pathway" && <Pathway />}
        {activeView === "advisor" && <Advisor onNavigate={go} />}
        {activeView === "products" && <ProductLibrary />}
        {activeView === "scripts" && <ScriptLibrary />}
        {activeView === "exams" && <ExamOverview />}
      </div>

      <footer>
        <div className="section-shell footer-inner">
          <Brand />
          <div className="footer-copy">
            <strong>Sổ tay tư vấn lộ trình tiếng Anh</strong>
            <span>Dành cho Đại sứ Galaxy Education · Cập nhật 24/07/2026</span>
          </div>
          <button
            className="footer-button"
            type="button"
            onClick={() => go("home")}
          >
            Về đầu trang ↑
          </button>
        </div>
      </footer>
    </main>
  );
}
