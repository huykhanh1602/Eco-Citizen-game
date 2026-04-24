export interface GameEvent {
  id: string;
  title: string;
  persona: string;
  avatarUrl: string;
  description: string;
  event_context: string;
  scientific_rules: string;
  severity: number;
}

export const eventPool: GameEvent[] = [
  {
    id: "EV_001",
    title: "CẢNH BÁO LŨ QUÉT VÀ SẠT LỞ ĐẤT DIỆN RỘNG!",
    persona: "Trưởng bản",
    avatarUrl: "/avatars/truong_ban.png",
    description: "Cứu chúng tôi với! Mưa lớn liên tục ba ngày nay khiến đất đá từ trên đồi có nguy cơ sạt lở bất cứ lúc nào. Nước suối dâng cao cuồn cuộn, một số căn nhà ở vùng trũng đã bị cuốn trôi. Xin hãy lập tức có biện pháp sơ tán người dân và gia cố sườn đồi trước khi quá muộn!",
    event_context: "Khu vực miền núi phía Bắc đang trải qua đợt mưa lớn bất thường do biến đổi khí hậu. Cường độ mưa vượt quá mức chịu đựng của kết cấu địa chất địa phương vốn đã bị suy yếu do nạn chặt phá rừng đầu nguồn. Nguy cơ sạt lở đất và lũ quét ở mức báo động đỏ.",
    scientific_rules: "Trừ điểm nặng Ngân sách nếu sơ tán chậm hoặc thiệt hại nhân mạng. Cộng điểm Môi trường và Niềm tin nếu có kế hoạch trồng rừng phòng hộ và hệ thống cảnh báo sớm. Trừ điểm Năng lượng nếu điều động máy móc cứu hộ tiêu tốn nhiều nhiên liệu mà không hiệu quả. Điểm Niềm tin tăng mạnh nếu đảm bảo an toàn 100% tính mạng người dân.",
    severity: 3
  },
  {
    id: "EV_002",
    title: "BÁO ĐỘNG KHẨN: HẠN HÁN KỶ LỤC TẠI ĐỒNG BẰNG SÔNG HỒNG",
    persona: "Người nông dân",
    avatarUrl: "/avatars/nong_dan.png",
    description: "Trời ơi, lúa đang thời kỳ trổ bông mà nứt nẻ hết cả ruộng rồi! Hơn hai tháng nay không có một giọt mưa, các hồ chứa đều trơ đáy. Máy bơm cũng không đủ điện để chạy. Nếu không có nước cứu lúa trong tuần này, cả làng tôi sẽ mất trắng vụ mùa!",
    event_context: "Hệ thống sông Hồng đang đối mặt với mực nước thấp kỷ lục do hiện tượng El Nino kéo dài, kết hợp với việc các đập thủy điện ở thượng nguồn tích nước. Tình trạng thiếu hụt nước ngọt đang đe dọa nghiêm trọng an ninh lương thực và đời sống của hàng triệu người dân vùng đồng bằng.",
    scientific_rules: "Cộng điểm Ngân sách và Niềm tin nếu phân bổ nguồn nước hợp lý và hỗ trợ nông dân chuyển đổi cây trồng chịu hạn. Trừ điểm Môi trường nếu xúi giục khai thác nước ngầm quá mức gây sụt lún. Cộng điểm Năng lượng nếu áp dụng công nghệ tưới tiêu thông minh, tiết kiệm năng lượng. Trừ nặng Niềm tin nếu để xảy ra mất mùa trên diện rộng.",
    severity: 2
  },
  {
    id: "EV_003",
    title: "MẤT ĐIỆN DIỆN RỘNG DO NẮNG NÓNG ĐỈNH ĐIỂM!",
    persona: "Kỹ sư Điện lực",
    avatarUrl: "/avatars/ky_su_dien.png",
    description: "Nhiệt độ ngoài trời đã vượt mức 42 độ C! Lượng tiêu thụ điện để làm mát tăng đột biến làm hệ thống lưới điện quá tải nghiêm trọng. Một số trạm biến áp đã phát nổ. Chúng tôi buộc phải cắt điện luân phiên, nhưng người già và bệnh nhân trong các khu vực mật độ dân số cao đang kiệt sức!",
    event_context: "Sóng nhiệt đô thị đang ở mức tồi tệ nhất trong vòng 50 năm qua. Hiệu ứng đảo nhiệt đô thị tại các thành phố lớn khiến nhiệt độ ban đêm không giảm nhiều, gây căng thẳng cực độ cho hệ thống điện lưới quốc gia và trực tiếp đe dọa sức khỏe cộng đồng.",
    scientific_rules: "Trừ điểm Niềm tin nặng nề nếu để tình trạng mất điện diện rộng kéo dài, đặc biệt ảnh hưởng đến cơ sở y tế. Cộng điểm Năng lượng nếu triển khai thành công các nguồn điện năng lượng tái tạo khẩn cấp và chiến dịch tiết kiệm điện. Cộng điểm Môi trường nếu có kế hoạch phát triển không gian xanh đô thị để giảm hiệu ứng đảo nhiệt dài hạn. Trừ Ngân sách do chi phí khắc phục sự cố lưới điện.",
    severity: 3
  },
  {
    id: "EV_004",
    title: "KHÔNG KHÍ ĐỘC HẠI: CHỈ SỐ PM2.5 VƯỢT MỨC NGUY HIỂM!",
    persona: "Bác sĩ Hô hấp",
    avatarUrl: "/avatars/bac_si.png",
    description: "Phòng cấp cứu của chúng tôi đã quá tải bệnh nhân hen suyễn và viêm phổi cấp! Màn sương mù dày đặc bao phủ thành phố mấy ngày nay thực chất là khói bụi độc hại. Trẻ em đang không thể đến trường. Chúng ta phải hành động ngay để cắt giảm nguồn phát thải từ các nhà máy và phương tiện giao thông!",
    event_context: "Hiện tượng nghịch nhiệt mùa đông kết hợp với lượng khí thải khổng lồ từ công nghiệp nặng và phương tiện giao thông cá nhân khiến bụi mịn PM2.5 bị giữ lại ở tầng thấp. Chỉ số ô nhiễm đã vượt tiêu chuẩn an toàn của WHO hơn 10 lần, gây nguy hại trực tiếp và cấp bách đến sinh mạng người dân.",
    scientific_rules: "Cộng điểm Môi trường và Niềm tin lớn nếu ban hành chính sách hạn chế khẩn cấp phương tiện cá nhân và đình chỉ các nhà máy xả thải. Trừ mạnh Niềm tin và Ngân sách (do chi phí y tế tăng vọt) nếu không có cảnh báo và biện pháp y tế kịp thời. Tăng điểm Năng lượng và Môi trường nếu đẩy mạnh hệ thống giao thông công cộng chạy điện.",
    severity: 2
  },
  {
    id: "EV_005",
    title: "HIỂM HỌA XÂM NHẬP MẶN: NƯỚC SÔNG ĐÃ THÀNH NƯỚC BIỂN!",
    persona: "Kỹ sư Đê điều",
    avatarUrl: "/avatars/ky_su_de.png",
    description: "Nguy to rồi! Nước mặn đã lấn sâu vào nội đồng hơn 60km! Nguồn nước sinh hoạt của người dân đang bị nhiễm mặn nghiêm trọng, các trạm cấp nước không thể xử lý nổi. Vườn cây ăn trái lâu năm của bà con đang rụng lá và chết khô. Cần có giải pháp khẩn cấp để ngăn mặn ngay lập tức!",
    event_context: "Do lưu lượng nước ngọt từ thượng nguồn sụt giảm nghiêm trọng trong mùa khô và hiện tượng nước biển dâng do biến đổi khí hậu, xâm nhập mặn đang diễn ra khốc liệt và sớm hơn dự kiến rất nhiều. Cơ sở hạ tầng thủy lợi hiện tại không đủ sức chống đỡ, đe dọa sinh kế và nguồn nước thiết yếu.",
    scientific_rules: "Cộng điểm Ngân sách và Niềm tin nếu đầu tư xây dựng các đập ngăn mặn tạm thời và hỗ trợ cấp nước ngọt bằng xe bồn kịp thời. Cộng điểm Môi trường nếu đưa ra chiến lược chuyển đổi mô hình canh tác thích ứng với biến đổi khí hậu về lâu dài. Trừ rất mạnh Niềm tin nếu để người dân thiếu nước sinh hoạt trầm trọng. Trừ điểm Môi trường nếu xây đập bê tông bừa bãi làm phá vỡ hệ sinh thái tự nhiên.",
    severity: 3
  }
];

export function getRandomEvent(): GameEvent {
  const randomIndex = Math.floor(Math.random() * eventPool.length);
  return eventPool[randomIndex];
}
