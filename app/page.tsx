"use client";

import {
  ArrowRight,
  BookOpenText,
  Check,
  ChevronRight,
  CircleHelp,
  Clipboard,
  Compass,
  GraduationCap,
  Headphones,
  Info,
  Lightbulb,
  Menu,
  MessageCircleMore,
  Route,
  Search,
  Sparkles,
  Target,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

type AdvisorAnswers = {
  age: string;
  level: string;
  goal: string;
  challenge: string;
};

type ProductKey = "speakwell" | "easypass" | "easyielts";

type Recommendation = {
  product: ProductKey;
  label: string;
  stage: string;
  title: string;
  summary: string;
  reasons: string[];
  checks: string[];
  questions: string[];
  script: string;
  secondary?: string;
};

const initialAnswers: AdvisorAnswers = {
  age: "",
  level: "",
  goal: "",
  challenge: "",
};

const questions = [
  {
    key: "age",
    eyebrow: "Câu 1/4",
    title: "Học sinh đang ở độ tuổi nào?",
    note: "Độ tuổi giúp xác định giai đoạn phát triển ngôn ngữ, chưa đủ để kết luận sản phẩm.",
    options: [
      ["4-6", "4–6 tuổi", "Mầm non / đầu tiểu học"],
      ["7-11", "7–11 tuổi", "Tiểu học"],
      ["12", "12 tuổi", "Giai đoạn chuyển tiếp"],
      ["13-15", "13–15 tuổi", "THCS"],
      ["16-18", "16–18 tuổi", "THPT"],
    ],
  },
  {
    key: "level",
    eyebrow: "Câu 2/4",
    title: "Nền tảng tiếng Anh hiện tại gần nhất với mô tả nào?",
    note: "Nếu chưa có kết quả đánh giá đáng tin cậy, hãy chọn “Chưa xác định”.",
    options: [
      ["unknown", "Chưa xác định", "Chưa test hoặc thông tin chưa rõ"],
      ["beginner", "Mới bắt đầu / mất gốc", "Khó dùng câu tiếng Anh đơn giản"],
      ["preA1", "Pre A1 / Starters", "Hiểu và dùng từ, cụm rất quen thuộc"],
      ["A1", "A1 / Movers", "Giao tiếp đơn giản trong tình huống quen thuộc"],
      ["A2", "A2 / Flyers", "Có nền tảng bốn kỹ năng cơ bản"],
      ["B1plus", "B1 trở lên", "Đã có nền tảng để học thuật và luyện thi"],
    ],
  },
  {
    key: "goal",
    eyebrow: "Câu 3/4",
    title: "Mục tiêu ưu tiên của gia đình là gì?",
    note: "Chọn mục tiêu cần giải quyết trước, không chọn tất cả mục tiêu dài hạn.",
    options: [
      ["YLE", "Cambridge YLE", "Starters, Movers hoặc Flyers"],
      ["general", "Năng lực toàn diện", "Phát triển Nghe, Nói, Đọc, Viết"],
      ["school", "Hỗ trợ học trên trường", "Củng cố kiến thức và kết quả học tập"],
      ["IELTS", "Chinh phục IELTS", "Có mục tiêu band tương đối rõ"],
      ["university", "Chuẩn bị cho đại học", "Dùng IELTS để mở rộng lựa chọn"],
    ],
  },
  {
    key: "challenge",
    eyebrow: "Câu 4/4",
    title: "Vấn đề cần ưu tiên xử lý là gì?",
    note: "Kết quả sẽ tập trung luận điểm tư vấn vào vấn đề phụ huynh quan tâm nhất.",
    options: [
      ["confidence", "Ngại nói, thiếu phản xạ", "Làm bài được nhưng chưa tự tin giao tiếp"],
      ["balanced", "Lệch kỹ năng", "Một số kỹ năng tiến bộ chậm hơn"],
      ["foundation", "Hổng nền tảng", "Từ vựng, ngữ pháp hoặc phát âm chưa chắc"],
      ["exam", "Chưa có chiến lược thi", "Cần lộ trình và kỹ thuật làm bài rõ ràng"],
    ],
  },
] as const;

const productMeta = {
  speakwell: {
    name: "SpeakWell",
    color: "green",
    audience: "4–12 tuổi",
    level: "Beginners → Flyers",
    promise: "Xây nền tảng bốn kỹ năng theo lộ trình Cambridge YLE.",
  },
  easypass: {
    name: "Easy PASS",
    color: "blue",
    audience: "12–18 tuổi",
    level: "A1 → B2",
    promise: "Tiếng Anh toàn diện cho tuổi Teens, gắn với học tập và ứng dụng.",
  },
  easyielts: {
    name: "Easy IELTS",
    color: "pink",
    audience: "Từ 12 tuổi",
    level: "IELTS 2.0 → 7.0+",
    promise: "Lộ trình luyện thi theo năng lực và mục tiêu band.",
  },
} as const;

const scripts = [
  {
    id: "discover",
    label: "Khai thác nhu cầu",
    title: "Mở đầu cuộc tư vấn",
    text: "Để em gợi ý đúng lộ trình cho con, chị cho em hỏi nhanh: hiện con đang học lớp mấy, khả năng nào con đang tự tin nhất, phần nào còn yếu và gia đình muốn ưu tiên giao tiếp, học trên trường hay một chứng chỉ cụ thể ạ?",
  },
  {
    id: "yle",
    label: "Giải thích YLE",
    title: "Starters, Movers, Flyers là gì?",
    text: "Starters, Movers và Flyers không chỉ là ba bài thi. Đây là các cột mốc Pre A1, A1 và A2 giúp ba mẹ nhìn rõ con đang nghe, nói, đọc, viết được gì. Vì vậy, mình nên chọn lộ trình dựa trên năng lực thực tế của con, không chỉ dựa vào tuổi hoặc mong muốn lấy chứng chỉ.",
  },
  {
    id: "speakwell",
    label: "Gợi ý SpeakWell",
    title: "Từ nhu cầu Cambridge đến SpeakWell",
    text: "Với độ tuổi và nền tảng hiện tại, con nên ưu tiên xây năng lực tiếng Anh thực chất theo lộ trình Cambridge. SpeakWell phát triển đồng thời bốn kỹ năng qua lớp học cùng giáo viên, hoạt động tương tác, LMS và công cụ luyện nói. Chứng chỉ là cột mốc ghi nhận, còn nền tảng sử dụng tiếng Anh mới là mục tiêu chính.",
  },
  {
    id: "transition",
    label: "Sau Flyers",
    title: "Chọn hướng đi sau Flyers",
    text: "Sau Flyers, con đã có nền tảng tương đương A2. Bước tiếp theo không có một đáp án chung: nếu con cần củng cố tiếng Anh tổng quát và học trên trường, Easy PASS phù hợp hơn; nếu con đã có mục tiêu IELTS rõ và sẵn sàng học theo hướng học thuật, mình mới cân nhắc Easy IELTS.",
  },
  {
    id: "ielts",
    label: "IELTS & đại học",
    title: "Giải thích vai trò của IELTS",
    text: "IELTS không phải đích đến duy nhất, nhưng có thể mở rộng lựa chọn trên hành trình vào đại học: hỗ trợ đáp ứng chuẩn đầu vào, tăng lựa chọn chương trình đào tạo và tạo nền tảng học thuật bằng tiếng Anh. Điều quan trọng là xác định band mục tiêu, thời gian chuẩn bị và năng lực hiện tại trước khi chọn lộ trình.",
  },
  {
    id: "uncertain",
    label: "Chưa đủ dữ liệu",
    title: "Khi chưa thể kết luận",
    text: "Thông tin hiện tại chưa đủ để kết luận con phù hợp với khóa nào. Mình nên đánh giá đầu vào và làm rõ mục tiêu ưu tiên trước. Sau khi có kết quả, em sẽ đối chiếu khoảng cách từ năng lực hiện tại tới mục tiêu để tư vấn lộ trình sát hơn, tránh học quá dễ hoặc quá sức.",
  },
];

const faqs = [
  {
    q: "Con còn nhỏ, học Cambridge có tạo áp lực không?",
    a: "Cambridge YLE là khung tham chiếu năng lực phù hợp với trẻ em. Áp lực thường đến từ cách học quá thiên về luyện đề. Nên ưu tiên xây từ vựng, phát âm, nghe hiểu và phản xạ qua hoạt động gần gũi; chỉ làm quen dạng thi khi nền tảng đã sẵn sàng.",
  },
  {
    q: "Học SpeakWell có phải chỉ để luyện thi chứng chỉ?",
    a: "Không. SpeakWell lấy năng lực bốn kỹ năng làm nền tảng và dùng Beginners, Starters, Movers, Flyers làm các cột mốc. Mục tiêu là giúp trẻ sử dụng tiếng Anh ngày càng độc lập; chứng chỉ là một cách ghi nhận tiến bộ.",
  },
  {
    q: "Tại sao không học IELTS càng sớm càng tốt?",
    a: "IELTS đòi hỏi nền tảng ngôn ngữ, tư duy học thuật và mức độ trưởng thành nhất định. Học quá sớm khi nền tảng chưa vững dễ biến thành học mẹo. Cần nhìn đồng thời độ tuổi, trình độ, mục tiêu band và thời gian sử dụng kết quả.",
  },
  {
    q: "Con 12 tuổi nên học SpeakWell hay Easy PASS?",
    a: "Đây là tuổi chuyển tiếp nên không quyết định chỉ bằng tuổi. Nếu con vẫn cần hoàn thiện chặng YLE hoặc đang ở Pre A1–A1, có thể tiếp tục SpeakWell. Nếu con đã có nền tảng phù hợp và cần tiếng Anh tổng quát cho giai đoạn THCS, Easy PASS thường hợp lý hơn.",
  },
  {
    q: "Con làm bài khá nhưng vẫn ngại giao tiếp, xử lý thế nào?",
    a: "Đây thường là khoảng cách giữa kiến thức và khả năng sử dụng. Con cần được nghe đủ, nói trong tình huống có ý nghĩa, nhận phản hồi đúng lúc và lặp lại thường xuyên trong môi trường không sợ sai.",
  },
  {
    q: "Làm sao biết con đang thực sự tiến bộ?",
    a: "Không chỉ nhìn điểm. Hãy theo dõi khả năng nghe hiểu, độ dài và rõ ràng của câu nói, mức độ chủ động, khả năng vận dụng kiến thức vào tình huống mới và kết quả đánh giá định kỳ.",
  },
];

function getRecommendation(answers: AdvisorAnswers): Recommendation {
  const young = answers.age === "4-6" || answers.age === "7-11";
  const transitionAge = answers.age === "12";
  const teen = answers.age === "13-15" || answers.age === "16-18";
  const weakFoundation =
    answers.level === "unknown" ||
    answers.level === "beginner" ||
    answers.level === "preA1";
  const hasIELTSBase =
    answers.level === "A1" ||
    answers.level === "A2" ||
    answers.level === "B1plus";
  const academicGoal =
    answers.goal === "IELTS" || answers.goal === "university";

  if (
    young ||
    (transitionAge &&
      (answers.goal === "YLE" ||
        answers.level === "preA1" ||
        answers.level === "A1"))
  ) {
    const caution = academicGoal
      ? "Gia đình đang quan tâm IELTS, nhưng ở chặng này nên xác lập nền tảng và mốc năng lực gần nhất trước."
      : "Đối chiếu thêm trình độ thực tế để chọn đúng Beginners, Starters, Movers hoặc Flyers.";
    return {
      product: "speakwell",
      label: "Ưu tiên",
      stage: "Cambridge Young Learners",
      title: "Xây nền tảng với SpeakWell",
      summary:
        "Hồ sơ đang phù hợp với lộ trình phát triển bốn kỹ năng theo Cambridge YLE, chú trọng sử dụng tiếng Anh trước khi đặt nặng luyện đề.",
      reasons: [
        "Độ tuổi phù hợp với học liệu và hoạt động ngôn ngữ dành cho trẻ.",
        answers.goal === "YLE"
          ? "Mục tiêu gia đình trùng với lộ trình Beginners → Starters → Movers → Flyers."
          : "Nền tảng ở chặng Pre A1–A2 cần được củng cố đồng đều bốn kỹ năng.",
        answers.challenge === "confidence"
          ? "Lớp học tương tác, LMS và công cụ luyện nói hỗ trợ tăng cơ hội thực hành."
          : "Mô hình 7E giúp trẻ khám phá, thực hành, đánh giá và mở rộng kiến thức.",
      ],
      checks: [
        caution,
        "Không suy ra cấp độ chỉ từ tuổi hoặc điểm tiếng Anh trên trường.",
      ],
      questions: [
        "Con đã từng học hoặc thi Starters, Movers, Flyers chưa?",
        "Con có thể nghe hiểu và trả lời câu hỏi quen thuộc ở mức nào?",
        "Gia đình ưu tiên giao tiếp, nền tảng hay một mốc chứng chỉ cụ thể?",
      ],
      script:
        "Với độ tuổi và nền tảng hiện tại, em đề xuất gia đình ưu tiên SpeakWell để con phát triển đồng đều Nghe, Nói, Đọc, Viết theo lộ trình Cambridge YLE. Mình sẽ xác định đúng cấp độ trước, sau đó mới đặt mốc Starters, Movers hoặc Flyers phù hợp để con tiến bộ mà không bị quá sức.",
      secondary:
        academicGoal
          ? "Hướng dài hạn: hoàn thiện A2/Flyers rồi đánh giá mức sẵn sàng cho IELTS."
          : undefined,
    };
  }

  if ((transitionAge || teen) && academicGoal && hasIELTSBase) {
    return {
      product: "easyielts",
      label: "Ưu tiên",
      stage: "IELTS & định hướng đại học",
      title: "Cân nhắc Easy IELTS",
      summary:
        "Học sinh đã có nền tảng tối thiểu và mục tiêu IELTS tương đối rõ. Bước tiếp theo là xác định band hiện tại, band mục tiêu và quỹ thời gian.",
      reasons: [
        "Mục tiêu học tập gắn trực tiếp với IELTS hoặc hành trình vào đại học.",
        "Nền tảng khai báo đủ để cân nhắc lộ trình IELTS theo cấp độ.",
        answers.challenge === "exam"
          ? "Nhu cầu trọng tâm là chiến lược, cấu trúc và kỹ năng làm bài."
          : "Chương trình kết hợp lớp live, tự luyện và đánh giá tiến bộ theo lộ trình.",
      ],
      checks: [
        "Cần đánh giá đầu vào trước khi chọn Introduction, Foundation, Preparation, Intensive hoặc Master.",
        "Chốt band mục tiêu, thời điểm cần chứng chỉ và thời lượng học có thể duy trì.",
      ],
      questions: [
        "Học sinh đã có kết quả IELTS hoặc bài đánh giá gần nhất chưa?",
        "Band mục tiêu và thời điểm cần sử dụng chứng chỉ là khi nào?",
        "Kỹ năng nào đang tạo khoảng cách lớn nhất tới mục tiêu?",
      ],
      script:
        "Vì con đã có nền tảng và mục tiêu IELTS rõ, em đề xuất đánh giá đầu vào để xác định band hiện tại, khoảng cách tới band mục tiêu và cấp độ Easy IELTS phù hợp. Sau đó mình mới chốt lộ trình, tránh học theo tuổi hoặc chọn lớp cao hơn năng lực thực tế.",
    };
  }

  if ((transitionAge || teen) && academicGoal && weakFoundation) {
    return {
      product: "easypass",
      label: "Xây nền trước",
      stage: "Cầu nối tới IELTS",
      title: "Củng cố với Easy PASS trước IELTS",
      summary:
        "Mục tiêu IELTS là hợp lý, nhưng dữ liệu hiện tại cho thấy cần làm chắc nền tảng tiếng Anh tổng quát trước khi chuyển sang luyện thi chuyên sâu.",
      reasons: [
        "Học sinh ở độ tuổi Teens nhưng nền tảng hiện tại chưa được xác định chắc chắn.",
        "Easy PASS phát triển bốn kỹ năng từ A1 đến B2 và bổ trợ khả năng học tập.",
        "Xây nền trước giúp giảm phụ thuộc vào mẹo và tăng khả năng theo lộ trình IELTS bền vững.",
      ],
      checks: [
        "Tổ chức đánh giá đầu vào để xác nhận có thực sự mất gốc hay chỉ lệch kỹ năng.",
        "Xác định mốc chuyển tiếp sang IELTS dựa trên năng lực, không dựa riêng vào thời gian học.",
      ],
      questions: [
        "Con đang gặp khó ở kiến thức nền hay ở riêng một kỹ năng?",
        "Mục tiêu IELTS là dài hạn hay cần kết quả trong 6–12 tháng?",
        "Con có thể duy trì việc tự luyện ngoài giờ học đến mức nào?",
      ],
      script:
        "Gia đình có thể giữ IELTS là mục tiêu dài hạn, nhưng trước mắt con cần củng cố nền tảng bốn kỹ năng. Em đề xuất đánh giá đầu vào và cân nhắc Easy PASS trước; khi năng lực đã đủ vững, mình chuyển sang Easy IELTS sẽ hiệu quả và ít áp lực hơn.",
      secondary: "Hướng tiếp theo: chuyển Easy IELTS khi đạt nền tảng phù hợp và có band mục tiêu rõ.",
    };
  }

  return {
    product: "easypass",
    label: "Ưu tiên",
    stage: "General English cho tuổi Teens",
    title: "Phát triển toàn diện với Easy PASS",
    summary:
      "Hồ sơ phù hợp với lộ trình tiếng Anh tổng quát cho học sinh 12–18 tuổi, cân bằng bốn kỹ năng và hỗ trợ việc học ở trường.",
    reasons: [
      "Mục tiêu ưu tiên là năng lực tổng quát hoặc kết quả học tập, chưa cần luyện thi IELTS chuyên sâu.",
      "Lộ trình A1–B2 tạo cầu nối từ nền tảng cơ bản tới khả năng sử dụng độc lập.",
      answers.challenge === "confidence"
        ? "Hoạt động theo tình huống giúp chuyển kiến thức thành khả năng giao tiếp."
        : "Phương pháp 7E, học theo nhiệm vụ và LMS tăng thời lượng thực hành.",
    ],
    checks: [
      "Đánh giá đầu vào để xác định đúng cấp độ A1, A2, B1 hoặc B2.",
      "Làm rõ ưu tiên giữa bổ trợ học trên trường, giao tiếp và chứng chỉ dài hạn.",
    ],
    questions: [
      "Điểm yếu hiện tại nằm ở kiến thức trên trường hay khả năng sử dụng tiếng Anh?",
      "Con cần cải thiện kỹ năng nào rõ nhất trong 3–6 tháng tới?",
      "Gia đình có mục tiêu chứng chỉ nào sau khi nền tảng ổn định không?",
    ],
    script:
      "Với độ tuổi và mục tiêu hiện tại, Easy PASS phù hợp hơn vì con cần phát triển đồng đều bốn kỹ năng và củng cố khả năng học tiếng Anh ở giai đoạn Teens. Mình nên đánh giá đầu vào để chọn đúng cấp độ A1–B2, rồi mới chốt mục tiêu gần và lộ trình tiếp theo.",
  };
}

function BrandMark() {
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

function CopyButton({
  text,
  compact = false,
}: {
  text: string;
  compact?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  async function copyText() {
    try {
      if (!navigator.clipboard || !window.isSecureContext) {
        throw new Error("Clipboard API unavailable");
      }
      await navigator.clipboard.writeText(text);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <button
      className={compact ? "copy-button compact" : "copy-button"}
      onClick={copyText}
      type="button"
    >
      {copied ? <Check size={17} /> : <Clipboard size={17} />}
      {copied ? "Đã sao chép" : "Sao chép"}
    </button>
  );
}

export default function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [advisorStep, setAdvisorStep] = useState(0);
  const [answers, setAnswers] = useState<AdvisorAnswers>(initialAnswers);
  const [showResult, setShowResult] = useState(false);
  const [activeScript, setActiveScript] = useState(scripts[0].id);

  const recommendation = useMemo(() => getRecommendation(answers), [answers]);
  const currentQuestion = questions[advisorStep];
  const currentValue =
    answers[currentQuestion.key as keyof AdvisorAnswers] || "";
  const activeScriptData =
    scripts.find((script) => script.id === activeScript) ?? scripts[0];

  function selectAnswer(key: keyof AdvisorAnswers, value: string) {
    setAnswers((previous) => ({ ...previous, [key]: value }));
  }

  function nextStep() {
    if (!currentValue) return;
    if (advisorStep === questions.length - 1) {
      setShowResult(true);
      return;
    }
    setAdvisorStep((step) => step + 1);
  }

  function resetAdvisor() {
    setAnswers(initialAnswers);
    setAdvisorStep(0);
    setShowResult(false);
  }

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  }

  const product = productMeta[recommendation.product];

  return (
    <main>
      <header className="site-header">
        <div className="header-inner">
          <button
            className="brand-button"
            type="button"
            onClick={() => scrollTo("top")}
            aria-label="Về đầu trang"
          >
            <BrandMark />
          </button>

          <nav className="desktop-nav" aria-label="Điều hướng chính">
            <button onClick={() => scrollTo("pathway")} type="button">
              Bản đồ lộ trình
            </button>
            <button onClick={() => scrollTo("advisor")} type="button">
              Gợi ý tư vấn
            </button>
            <button onClick={() => scrollTo("products")} type="button">
              Sản phẩm
            </button>
            <button onClick={() => scrollTo("scripts")} type="button">
              Kịch bản
            </button>
            <button onClick={() => scrollTo("faq")} type="button">
              Xử lý phản đối
            </button>
          </nav>

          <button
            className="header-cta"
            onClick={() => scrollTo("advisor")}
            type="button"
          >
            Bắt đầu tư vấn
            <ArrowRight size={17} />
          </button>

          <button
            className="menu-button"
            onClick={() => setMobileOpen((open) => !open)}
            type="button"
            aria-label={mobileOpen ? "Đóng menu" : "Mở menu"}
          >
            {mobileOpen ? <X /> : <Menu />}
          </button>
        </div>

        {mobileOpen && (
          <nav className="mobile-nav" aria-label="Điều hướng di động">
            {[
              ["pathway", "Bản đồ lộ trình"],
              ["advisor", "Gợi ý tư vấn"],
              ["products", "Sản phẩm"],
              ["scripts", "Kịch bản"],
              ["faq", "Xử lý phản đối"],
            ].map(([id, label]) => (
              <button key={id} onClick={() => scrollTo(id)} type="button">
                {label}
                <ChevronRight size={18} />
              </button>
            ))}
          </nav>
        )}
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
              <Sparkles size={16} />
              Sổ tay tư vấn thông minh dành cho Đại sứ
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
                onClick={() => scrollTo("advisor")}
                type="button"
              >
                <Compass size={19} />
                Gợi ý hướng tư vấn
              </button>
              <button
                className="secondary-button"
                onClick={() => scrollTo("pathway")}
                type="button"
              >
                Xem bản đồ lộ trình
                <ArrowRight size={18} />
              </button>
            </div>
            <div className="hero-note">
              <Info size={17} />
              Công cụ đưa ra định hướng ban đầu, không thay thế kết quả đánh giá
              đầu vào.
            </div>
          </div>

          <div className="hero-panel">
            <div className="panel-topline">
              <div>
                <span>Tra cứu nhanh</span>
                <strong>Học sinh đang ở chặng nào?</strong>
              </div>
              <div className="live-pill">
                <span />
                Sẵn sàng
              </div>
            </div>

            <div className="mini-path">
              <article className="mini-card green">
                <span className="mini-icon">
                  <Headphones size={20} />
                </span>
                <div>
                  <small>4–12 tuổi</small>
                  <strong>Cambridge YLE</strong>
                  <p>Beginners → Flyers</p>
                </div>
              </article>
              <div className="path-connector">
                <ArrowRight size={18} />
              </div>
              <article className="mini-card blue">
                <span className="mini-icon">
                  <BookOpenText size={20} />
                </span>
                <div>
                  <small>12–18 tuổi</small>
                  <strong>General English</strong>
                  <p>A1 → B2</p>
                </div>
              </article>
              <div className="path-connector">
                <ArrowRight size={18} />
              </div>
              <article className="mini-card pink">
                <span className="mini-icon">
                  <GraduationCap size={20} />
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
              onClick={() => scrollTo("advisor")}
              type="button"
            >
              Nhập hồ sơ học sinh
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      <section className="quick-section">
        <div className="section-shell">
          <div className="quick-grid">
            {[
              {
                icon: Route,
                title: "Xem lộ trình",
                text: "Giải thích YLE, CEFR và IELTS trên cùng một bản đồ.",
                id: "pathway",
                color: "green",
              },
              {
                icon: Compass,
                title: "Gợi ý tư vấn",
                text: "Chọn hồ sơ và nhận hướng tư vấn có giải thích.",
                id: "advisor",
                color: "pink",
              },
              {
                icon: Search,
                title: "Tra cứu sản phẩm",
                text: "Đúng đối tượng, mục tiêu và trường hợp không nên ép bán.",
                id: "products",
                color: "blue",
              },
              {
                icon: MessageCircleMore,
                title: "Lấy kịch bản",
                text: "Sao chép đoạn tư vấn để dùng nhanh trên Zalo.",
                id: "scripts",
                color: "yellow",
              },
            ].map((item) => (
              <button
                className={`quick-card ${item.color}`}
                key={item.title}
                onClick={() => scrollTo(item.id)}
                type="button"
              >
                <span className="quick-icon">
                  <item.icon size={21} />
                </span>
                <span>
                  <strong>{item.title}</strong>
                  <small>{item.text}</small>
                </span>
                <ChevronRight className="quick-arrow" size={20} />
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="content-section pathway-section" id="pathway">
        <div className="section-shell">
          <div className="section-heading split-heading">
            <div>
              <span className="section-kicker">Bản đồ năng lực</span>
              <h2>Một hành trình, ba chặng phát triển</h2>
            </div>
            <p>
              Không đặt sản phẩm lên trước. Hãy xác định học sinh đang ở đâu,
              cần đạt năng lực gì tiếp theo, rồi mới chọn chương trình.
            </p>
          </div>

          <div className="journey" role="list" aria-label="Hành trình tiếng Anh">
            <article className="journey-card green-card" role="listitem">
              <div className="journey-number">01</div>
              <div className="journey-head">
                <span className="journey-icon">
                  <Headphones />
                </span>
                <div>
                  <small>Cambridge Young Learners</small>
                  <h3>Xây nền tảng</h3>
                </div>
              </div>
              <div className="level-list">
                <div>
                  <span>Beginners</span>
                  <small>Làm quen nền tảng</small>
                </div>
                <div>
                  <span>Pre A1 Starters</span>
                  <small>Ngôn ngữ rất quen thuộc</small>
                </div>
                <div>
                  <span>A1 Movers</span>
                  <small>Giao tiếp đơn giản</small>
                </div>
                <div>
                  <span>A2 Flyers</span>
                  <small>Sử dụng độc lập hơn</small>
                </div>
              </div>
              <div className="journey-product">
                <strong>SpeakWell</strong>
                <span>4–12 tuổi</span>
              </div>
            </article>

            <div className="journey-arrow" aria-hidden="true">
              <ArrowRight />
            </div>

            <article className="journey-card blue-card" role="listitem">
              <div className="journey-number">02</div>
              <div className="journey-head">
                <span className="journey-icon">
                  <BookOpenText />
                </span>
                <div>
                  <small>General English</small>
                  <h3>Phát triển toàn diện</h3>
                </div>
              </div>
              <div className="cefr-track">
                <div>
                  <span>A1</span>
                  <i />
                </div>
                <div>
                  <span>A2</span>
                  <i />
                </div>
                <div>
                  <span>B1</span>
                  <i />
                </div>
                <div>
                  <span>B2</span>
                  <i />
                </div>
              </div>
              <ul className="plain-checks">
                <li>
                  <Check size={16} /> Cân bằng Nghe, Nói, Đọc, Viết
                </li>
                <li>
                  <Check size={16} /> Hỗ trợ học tập ở giai đoạn Teens
                </li>
                <li>
                  <Check size={16} /> Tạo cầu nối tới mục tiêu học thuật
                </li>
              </ul>
              <div className="journey-product">
                <strong>Easy PASS</strong>
                <span>12–18 tuổi</span>
              </div>
            </article>

            <div className="journey-arrow" aria-hidden="true">
              <ArrowRight />
            </div>

            <article className="journey-card pink-card" role="listitem">
              <div className="journey-number">03</div>
              <div className="journey-head">
                <span className="journey-icon">
                  <GraduationCap />
                </span>
                <div>
                  <small>IELTS & đại học</small>
                  <h3>Học theo mục tiêu</h3>
                </div>
              </div>
              <div className="band-track">
                {["2.0", "3.0", "4.0", "5.0", "6.0", "7.0+"].map((band) => (
                  <span key={band}>{band}</span>
                ))}
              </div>
              <ul className="plain-checks">
                <li>
                  <Check size={16} /> Xác định band hiện tại và mục tiêu
                </li>
                <li>
                  <Check size={16} /> Phát triển kỹ năng học thuật
                </li>
                <li>
                  <Check size={16} /> Chuẩn bị theo quỹ thời gian thực tế
                </li>
              </ul>
              <div className="journey-product">
                <strong>Easy IELTS</strong>
                <span>Từ 12 tuổi</span>
              </div>
            </article>
          </div>

          <div className="transition-callout">
            <span className="callout-icon">
              <Lightbulb />
            </span>
            <div>
              <strong>Điểm chuyển tiếp cần tư vấn kỹ</strong>
              <p>
                Sau Flyers hoặc ở tuổi 12, không mặc định chuyển thẳng sang
                IELTS. Nếu ưu tiên tiếng Anh tổng quát và học trên trường, cân
                nhắc Easy PASS; nếu đã có nền tảng và mục tiêu band rõ, mới cân
                nhắc Easy IELTS.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="content-section advisor-section" id="advisor">
        <div className="section-shell">
          <div className="section-heading centered-heading">
            <span className="section-kicker">Trợ lý tư vấn nhanh</span>
            <h2>Gợi ý hướng tư vấn trong khoảng 60 giây</h2>
            <p>
              Chọn mô tả gần nhất. Kết quả luôn đi kèm lý do đề xuất và thông
              tin cần kiểm tra thêm.
            </p>
          </div>

          <div className="advisor-card">
            {!showResult ? (
              <>
                <div className="advisor-progress">
                  <div className="progress-meta">
                    <span>{currentQuestion.eyebrow}</span>
                    <strong>{Math.round(((advisorStep + 1) / 4) * 100)}%</strong>
                  </div>
                  <div className="progress-track">
                    <span style={{ width: `${((advisorStep + 1) / 4) * 100}%` }} />
                  </div>
                </div>

                <div className="question-block">
                  <h3>{currentQuestion.title}</h3>
                  <p>{currentQuestion.note}</p>
                  <div className="option-grid">
                    {currentQuestion.options.map(([value, label, detail]) => (
                      <button
                        className={currentValue === value ? "option selected" : "option"}
                        key={value}
                        onClick={() =>
                          selectAnswer(
                            currentQuestion.key as keyof AdvisorAnswers,
                            value,
                          )
                        }
                        type="button"
                      >
                        <span className="option-radio">
                          {currentValue === value && <Check size={15} />}
                        </span>
                        <span>
                          <strong>{label}</strong>
                          <small>{detail}</small>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="advisor-actions">
                  <button
                    className="text-button"
                    disabled={advisorStep === 0}
                    onClick={() => setAdvisorStep((step) => Math.max(0, step - 1))}
                    type="button"
                  >
                    Quay lại
                  </button>
                  <button
                    className="primary-button"
                    disabled={!currentValue}
                    onClick={nextStep}
                    type="button"
                  >
                    {advisorStep === questions.length - 1
                      ? "Xem gợi ý"
                      : "Tiếp tục"}
                    <ArrowRight size={18} />
                  </button>
                </div>
              </>
            ) : (
              <div className="result-wrap">
                <div className="result-header">
                  <div className={`result-product-icon ${product.color}`}>
                    {recommendation.product === "speakwell" && <Headphones />}
                    {recommendation.product === "easypass" && <BookOpenText />}
                    {recommendation.product === "easyielts" && <GraduationCap />}
                  </div>
                  <div>
                    <span>{recommendation.label} · {recommendation.stage}</span>
                    <h3>{recommendation.title}</h3>
                    <p>{recommendation.summary}</p>
                  </div>
                  <button
                    className="restart-button"
                    onClick={resetAdvisor}
                    type="button"
                  >
                    Làm lại
                  </button>
                </div>

                <div className="result-grid">
                  <article className="result-panel">
                    <h4>
                      <Target size={18} /> Vì sao đề xuất?
                    </h4>
                    <ul>
                      {recommendation.reasons.map((reason) => (
                        <li key={reason}>
                          <Check size={16} />
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                  <article className="result-panel warning">
                    <h4>
                      <CircleHelp size={18} /> Cần kiểm tra thêm
                    </h4>
                    <ul>
                      {recommendation.checks.map((check) => (
                        <li key={check}>
                          <Info size={16} />
                          <span>{check}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                </div>

                <article className={`recommended-product ${product.color}`}>
                  <div>
                    <small>Chương trình gợi ý</small>
                    <h4>{product.name}</h4>
                    <p>{product.promise}</p>
                  </div>
                  <div className="product-facts">
                    <span>
                      <small>Đối tượng</small>
                      <strong>{product.audience}</strong>
                    </span>
                    <span>
                      <small>Lộ trình</small>
                      <strong>{product.level}</strong>
                    </span>
                  </div>
                </article>

                {recommendation.secondary && (
                  <div className="secondary-direction">
                    <Route size={18} />
                    {recommendation.secondary}
                  </div>
                )}

                <div className="result-lower-grid">
                  <article className="followup-box">
                    <h4>3 câu hỏi Đại sứ nên hỏi tiếp</h4>
                    <ol>
                      {recommendation.questions.map((question) => (
                        <li key={question}>{question}</li>
                      ))}
                    </ol>
                  </article>
                  <article className="script-box">
                    <div className="script-box-head">
                      <h4>Tin nhắn gợi ý cho phụ huynh</h4>
                      <CopyButton text={recommendation.script} compact />
                    </div>
                    <p>{recommendation.script}</p>
                  </article>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="content-section products-section" id="products">
        <div className="section-shell">
          <div className="section-heading split-heading">
            <div>
              <span className="section-kicker">Thư viện sản phẩm</span>
              <h2>Chọn theo nhu cầu, không chọn theo tên khóa học</h2>
            </div>
            <p>
              Mỗi chương trình có một vai trò riêng trên hành trình. Hãy dùng
              phần “không nên tư vấn khi” để tránh ghép sai nhu cầu.
            </p>
          </div>

          <div className="product-grid">
            <article className="product-card green-product">
              <div className="product-card-top">
                <span className="product-card-icon">
                  <Headphones />
                </span>
                <div>
                  <small>Cambridge Young Learners</small>
                  <h3>SpeakWell</h3>
                </div>
              </div>
              <p className="product-lead">
                Chương trình tiếng Anh trực tuyến toàn diện cho trẻ 4–12 tuổi,
                định hướng Cambridge YLE.
              </p>
              <dl>
                <div>
                  <dt>Đối tượng</dt>
                  <dd>Trẻ cần xây nền tảng hoặc đi theo Beginners → Flyers.</dd>
                </div>
                <div>
                  <dt>Giá trị cốt lõi</dt>
                  <dd>Bốn kỹ năng, phương pháp 7E, học liệu tương tác, LMS và luyện nói.</dd>
                </div>
                <div>
                  <dt>Nên tư vấn khi</dt>
                  <dd>Phụ huynh quan tâm nền tảng, giao tiếp và chứng chỉ Cambridge.</dd>
                </div>
              </dl>
              <div className="avoid-box">
                <strong>Không nên tư vấn khi</strong>
                <p>Học sinh lớn hơn, đã qua A2 và cần chương trình Teens hoặc mục tiêu IELTS rõ.</p>
              </div>
            </article>

            <article className="product-card blue-product">
              <div className="product-card-top">
                <span className="product-card-icon">
                  <BookOpenText />
                </span>
                <div>
                  <small>General English</small>
                  <h3>Easy PASS</h3>
                </div>
              </div>
              <p className="product-lead">
                Chương trình tiếng Anh toàn diện cho học sinh 12–18 tuổi, từ A1
                đến B2.
              </p>
              <dl>
                <div>
                  <dt>Đối tượng</dt>
                  <dd>Tuổi Teens cần củng cố bốn kỹ năng và hỗ trợ học tập.</dd>
                </div>
                <div>
                  <dt>Giá trị cốt lõi</dt>
                  <dd>7E, học theo tình huống, LMS và đánh giá tiến bộ định kỳ.</dd>
                </div>
                <div>
                  <dt>Nên tư vấn khi</dt>
                  <dd>Mục tiêu là nền tảng, học trên trường, giao tiếp hoặc cầu nối tới IELTS.</dd>
                </div>
              </dl>
              <div className="avoid-box">
                <strong>Không nên tư vấn khi</strong>
                <p>Học sinh đã có nền tảng phù hợp, band mục tiêu và thời hạn thi IELTS rõ.</p>
              </div>
            </article>

            <article className="product-card pink-product">
              <div className="product-card-top">
                <span className="product-card-icon">
                  <GraduationCap />
                </span>
                <div>
                  <small>IELTS & đại học</small>
                  <h3>Easy IELTS</h3>
                </div>
              </div>
              <p className="product-lead">
                Lộ trình luyện thi IELTS cá nhân hóa theo năng lực và mục tiêu
                band.
              </p>
              <dl>
                <div>
                  <dt>Đối tượng</dt>
                  <dd>Học sinh từ 12 tuổi có nền tảng và mục tiêu IELTS cụ thể.</dd>
                </div>
                <div>
                  <dt>Giá trị cốt lõi</dt>
                  <dd>Introduction → Master, lớp live trên ICAN Learning Platform và tự luyện.</dd>
                </div>
                <div>
                  <dt>Nên tư vấn khi</dt>
                  <dd>Có band mục tiêu, thời điểm cần chứng chỉ và khả năng duy trì lộ trình.</dd>
                </div>
              </dl>
              <div className="avoid-box">
                <strong>Không nên tư vấn khi</strong>
                <p>Chỉ chọn vì “IELTS đang cần” nhưng chưa rõ nền tảng, mục tiêu hoặc thời gian sử dụng.</p>
              </div>
            </article>
          </div>

          <div className="source-note">
            <Info size={18} />
            <span>
              Thông tin học phí, ưu đãi, lịch khai giảng và cấu hình lớp có thể
              thay đổi. Đại sứ cần kiểm tra thông báo vận hành mới nhất trước
              khi chốt với phụ huynh.
            </span>
          </div>
        </div>
      </section>

      <section className="content-section scripts-section" id="scripts">
        <div className="section-shell">
          <div className="section-heading centered-heading">
            <span className="section-kicker">Kịch bản dùng ngay</span>
            <h2>Nói đúng trọng tâm, giữ giọng tư vấn tự nhiên</h2>
            <p>
              Chọn tình huống, điều chỉnh tên và bối cảnh học sinh, sau đó sao
              chép để gửi phụ huynh.
            </p>
          </div>

          <div className="script-workspace">
            <div className="script-tabs" role="tablist" aria-label="Tình huống tư vấn">
              {scripts.map((script) => (
                <button
                  aria-selected={activeScript === script.id}
                  className={activeScript === script.id ? "active" : ""}
                  key={script.id}
                  onClick={() => setActiveScript(script.id)}
                  role="tab"
                  type="button"
                >
                  {script.label}
                  <ChevronRight size={17} />
                </button>
              ))}
            </div>
            <article className="script-preview">
              <div className="script-preview-top">
                <div className="zalo-avatar">GE</div>
                <div>
                  <small>Kịch bản đề xuất</small>
                  <h3>{activeScriptData.title}</h3>
                </div>
              </div>
              <div className="message-bubble">{activeScriptData.text}</div>
              <div className="script-preview-footer">
                <span>
                  <Info size={16} />
                  Cá nhân hóa trước khi gửi
                </span>
                <CopyButton text={activeScriptData.text} />
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="content-section faq-section" id="faq">
        <div className="section-shell faq-shell">
          <div className="faq-intro">
            <span className="section-kicker">Xử lý phản đối</span>
            <h2>Giải thích bằng logic học tập, không tranh luận với phụ huynh</h2>
            <p>
              Bắt đầu từ mối quan tâm của gia đình, làm rõ dữ liệu còn thiếu rồi
              mới đưa ra đề xuất.
            </p>
            <div className="faq-principle">
              <Lightbulb size={20} />
              <span>
                Công thức: <strong>Ghi nhận → Làm rõ → Giải thích → Đề xuất bước tiếp theo</strong>
              </span>
            </div>
          </div>
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <details key={faq.q} open={index === 0}>
                <summary>
                  <span>{faq.q}</span>
                  <span className="faq-plus">+</span>
                </summary>
                <p>{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <footer>
        <div className="section-shell footer-inner">
          <BrandMark />
          <div className="footer-copy">
            <strong>Sổ tay tư vấn lộ trình tiếng Anh</strong>
            <span>Dành cho Đại sứ Galaxy Education · Cập nhật 23/07/2026</span>
          </div>
          <button
            className="footer-button"
            onClick={() => scrollTo("top")}
            type="button"
          >
            Về đầu trang
            <ArrowRight size={17} />
          </button>
        </div>
      </footer>
    </main>
  );
}
