"use client";

import { useEffect, useMemo, useState } from "react";

type Tone = "green" | "blue" | "pink";
type JourneyLevel = {
  id: string;
  label: string;
  sub: string;
  profile: string;
  canDo: string;
  counsel: string;
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

const advisorQuestions = [
  {
    key: "age",
    title: "Học sinh đang ở độ tuổi nào?",
    note: "Độ tuổi giúp xác định giai đoạn phát triển, nhưng chưa đủ để kết luận sản phẩm.",
    options: [
      ["7-11", "7-11 tuổi", "Tiểu học"],
      ["12", "12 tuổi", "Giai đoạn chuyển tiếp"],
      ["13-15", "13-15 tuổi", "THCS"],
      ["16-18", "16-18 tuổi", "THPT"],
    ],
  },
  {
    key: "level",
    title: "Nền tảng gần nhất của học sinh?",
    note: "Ưu tiên kết quả đánh giá hoặc chứng chỉ gần nhất; nếu chưa rõ, chọn “Chưa xác định”.",
    options: [
      ["yle", "Beginners - Movers", "Đang trong chặng nền tảng YLE"],
      ["a2", "Flyers / A2", "Đã có nền tảng sử dụng độc lập hơn"],
      ["b1", "B1 trở lên", "Có thể bắt đầu mục tiêu học thuật"],
      ["ielts", "Đã có band IELTS", "Có kết quả đánh giá tương đối rõ"],
      ["unknown", "Chưa xác định", "Cần đánh giá đầu vào"],
    ],
  },
  {
    key: "goal",
    title: "Mục tiêu ưu tiên của gia đình?",
    note: "Nếu có nhiều mục tiêu, chọn mục tiêu quan trọng nhất trong 6-12 tháng tới.",
    options: [
      ["cambridge", "Cambridge YLE", "Xây nền và có cột mốc chứng chỉ"],
      ["general", "Tiếng Anh tổng quát", "Bốn kỹ năng, học trên trường, giao tiếp"],
      ["ielts", "IELTS / đại học", "Có band hoặc kế hoạch sử dụng rõ"],
      ["unclear", "Chưa rõ mục tiêu", "Cần làm rõ nhu cầu trước"],
    ],
  },
  {
    key: "timeline",
    title: "Mức độ rõ ràng của kế hoạch?",
    note: "Một đề xuất tốt cần phù hợp cả năng lực, mục tiêu và khả năng duy trì.",
    options: [
      ["clear", "Đã rõ mốc thời gian", "Có thể xác định đầu ra và tiến độ"],
      ["flexible", "Có mục tiêu, thời gian linh hoạt", "Ưu tiên phát triển bền vững"],
      ["unknown", "Chưa đủ dữ liệu", "Nên đánh giá và tư vấn sâu hơn"],
    ],
  },
];

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

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
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
            },
            {
              id: "general",
              no: "02",
              label: "General English",
              title: "Phát triển toàn diện",
              sub: "A1 → B2",
              product: "Easy PASS · 12-18 tuổi",
            },
            {
              id: "ielts",
              no: "03",
              label: "IELTS & đại học",
              title: "Học theo mục tiêu",
              sub: "2.0 → 7.0+",
              product: "Easy IELTS · từ 12 tuổi",
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
              <em>{item.product}</em>
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

function Advisor() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const question = advisorQuestions[step];

  const recommendation = useMemo(() => {
    if (!done) return null;
    const { age, level, goal, timeline } = answers;
    if (level === "unknown" || goal === "unclear" || timeline === "unknown") {
      return {
        product: "Chưa nên chốt sản phẩm",
        reason:
          "Hồ sơ còn thiếu dữ liệu về trình độ, mục tiêu hoặc mốc thời gian. Bước có trách nhiệm nhất là đánh giá đầu vào và làm rõ ưu tiên.",
        action:
          "Mời học sinh đánh giá đầu vào; hỏi thêm điểm mạnh/yếu theo bốn kỹ năng và mục tiêu 6-12 tháng.",
        tone: "neutral",
      };
    }
    if (
      goal === "cambridge" ||
      (age === "7-11" && (level === "yle" || level === "a2"))
    ) {
      return {
        product: "SpeakWell",
        reason:
          "Học sinh thuộc nhóm 7-12 tuổi và cần xây nền Cambridge YLE, phát triển đồng đều bốn kỹ năng trước khi chuyển sang mục tiêu học thuật.",
        action:
          "Xác định đúng Beginners/Starters/Movers/Flyers và thống nhất năng lực mục tiêu có thể quan sát.",
        tone: "green",
      };
    }
    if (
      goal === "general" ||
      (age !== "7-11" && (level === "yle" || level === "a2"))
    ) {
      return {
        product: "Easy PASS",
        reason:
          "Mục tiêu trọng tâm là tiếng Anh tổng quát cho giai đoạn Teens, hỗ trợ bốn kỹ năng và tạo cầu nối từ A1/A2 lên B1/B2.",
        action:
          "Đánh giá mức CEFR, xác định kỹ năng nghẽn và chọn hình thức lớp phù hợp khả năng duy trì.",
        tone: "blue",
      };
    }
    return {
      product: "Easy IELTS",
      reason:
        "Học sinh có nền tảng và mục tiêu IELTS/đại học tương đối rõ. Lộ trình nên được thiết kế theo band hiện tại, band mục tiêu và quỹ thời gian.",
      action:
        "Xác minh kết quả đầu vào, kỹ năng thấp nhất và thời điểm cần chứng chỉ trước khi chọn chặng học.",
      tone: "pink",
    };
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
          <h2>Gợi ý hướng tư vấn trong khoảng 60 giây</h2>
          <p>
            Kết quả luôn đi kèm lý do đề xuất và bước cần kiểm tra thêm, không
            thay thế đánh giá đầu vào.
          </p>
        </div>
        <div className="advisor-card reveal">
          {!done ? (
            <>
              <div className="advisor-progress">
                <div className="progress-meta">
                  <span>
                    Câu {step + 1}/{advisorQuestions.length}
                  </span>
                  <strong>
                    {Math.round(((step + 1) / advisorQuestions.length) * 100)}%
                  </strong>
                </div>
                <div className="progress-track">
                  <span
                    style={{
                      width: `${((step + 1) / advisorQuestions.length) * 100}%`,
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
                    step === advisorQuestions.length - 1
                      ? setDone(true)
                      : setStep((n) => n + 1)
                  }
                  type="button"
                >
                  {step === advisorQuestions.length - 1
                    ? "Xem gợi ý"
                    : "Tiếp tục"}{" "}
                  →
                </button>
              </div>
            </>
          ) : (
            recommendation && (
              <div className={`advisor-result ${recommendation.tone}`}>
                <div className="result-kicker">Định hướng ban đầu</div>
                <h3>{recommendation.product}</h3>
                <div className="result-grid">
                  <div>
                    <strong>Vì sao phù hợp?</strong>
                    <p>{recommendation.reason}</p>
                  </div>
                  <div>
                    <strong>Bước tiếp theo</strong>
                    <p>{recommendation.action}</p>
                  </div>
                </div>
                <div className="result-actions">
                  <button className="secondary-button" onClick={reset}>
                    Làm lại
                  </button>
                  <button
                    className="primary-button"
                    onClick={() => scrollToId("scripts")}
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
              <small>{product.tag}</small>
              <strong>{product.name}</strong>
            </button>
          ))}
        </div>
        <article
          className={`product-dossier ${active.tone} reveal`}
          key={active.id}
        >
          <header>
            <div>
              <span>{active.tag}</span>
              <h3>{active.name}</h3>
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
          <h2>Từ khai thác nhu cầu đến chốt bước tiếp theo</h2>
          <p>
            Nội dung giữ vai trò tư vấn, có căn cứ và tôn trọng quyền quyết định
            của phụ huynh. Hãy cá nhân hóa trước khi gửi.
          </p>
        </div>
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
      </div>
    </section>
  );
}

function ObjectionLibrary() {
  const [query, setQuery] = useState("");
  const filtered = objections.filter((item) =>
    `${item.q} ${item.answer}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <section className="content-section faq-section" id="faq">
      <div className="section-shell">
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
    </section>
  );
}

export default function Page() {
  const [menuOpen, setMenuOpen] = useState(false);

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
  }, []);

  const go = (id: string) => {
    setMenuOpen(false);
    scrollToId(id);
  };

  return (
    <main>
      <header className="site-header">
        <div className="header-inner">
          <button
            className="brand-button"
            type="button"
            aria-label="Về đầu trang"
            onClick={() => go("top")}
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
              ["faq", "Xử lý phản đối"],
            ].map(([id, label]) => (
              <button onClick={() => go(id)} type="button" key={id}>
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
                <span className="mini-icon">🎧</span>
                <div>
                  <small>7-12 tuổi</small>
                  <strong>Cambridge YLE</strong>
                  <p>Beginners → Flyers</p>
                </div>
              </article>
              <div className="path-connector">→</div>
              <article className="mini-card blue">
                <span className="mini-icon">📖</span>
                <div>
                  <small>12-18 tuổi</small>
                  <strong>General English</strong>
                  <p>A1 → B2</p>
                </div>
              </article>
              <div className="path-connector">→</div>
              <article className="mini-card pink">
                <span className="mini-icon">🎓</span>
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
              ["pink", "advisor", "◉", "Gợi ý tư vấn", "Nhận đề xuất có giải thích trong 60 giây."],
              ["blue", "products", "⌕", "Tra cứu sản phẩm", "Lấy key tư vấn, câu hỏi và điểm loại trừ."],
              ["yellow", "scripts", "☵", "Lấy kịch bản", "Sao chép nội dung khéo léo để dùng trên Zalo."],
            ].map(([color, id, icon, title, text]) => (
              <button
                className={`quick-card ${color}`}
                onClick={() => go(id)}
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

      <Pathway />
      <Advisor />
      <ProductLibrary />
      <ScriptLibrary />
      <ObjectionLibrary />

      <footer>
        <div className="section-shell footer-inner">
          <Brand />
          <div className="footer-copy">
            <strong>Sổ tay tư vấn lộ trình tiếng Anh</strong>
            <span>Dành cho Đại sứ Galaxy Education · Cập nhật 23/07/2026</span>
          </div>
          <button
            className="footer-button"
            type="button"
            onClick={() => go("top")}
          >
            Về đầu trang ↑
          </button>
        </div>
      </footer>
    </main>
  );
}
