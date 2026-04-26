export interface LocalizedText {
  vi: string;
  en: string;
}

export interface GameEvent {
  id: string;
  title: LocalizedText;
  persona: LocalizedText;
  avatarUrl: string;
  description: LocalizedText;
  event_context: LocalizedText;
  scientific_rules: LocalizedText;
  severity: number;
}

export const eventPool: GameEvent[] = [
  {
    id: "EV_001",
    title: {
      vi: "CẢNH BÁO LŨ QUÉT VÀ SẠT LỞ ĐẤT DIỆN RỘNG!",
      en: "WARNING: WIDESPREAD FLASH FLOODS AND LANDSLIDES!"
    },
    persona: {
      vi: "Trưởng bản",
      en: "Village Chief"
    },
    avatarUrl: "/avatars/villagechef.png",
    description: {
      vi: "Cứu chúng tôi với! Mưa lớn liên tục ba ngày nay khiến đất đá từ trên đồi có nguy cơ sạt lở bất cứ lúc nào. Nước suối dâng cao cuồn cuộn, một số căn nhà ở vùng trũng đã bị cuốn trôi. Xin hãy lập tức có biện pháp sơ tán người dân và gia cố sườn đồi trước khi quá muộn!",
      en: "Help us! Heavy rains for three consecutive days have put rocks on the hills at risk of landslides at any time. The stream water is rising rapidly, and some houses in low-lying areas have been washed away. Please immediately evacuate the people and reinforce the hillside before it's too late!"
    },
    event_context: {
      vi: "Khu vực miền núi phía Bắc đang trải qua đợt mưa lớn bất thường do biến đổi khí hậu. Cường độ mưa vượt quá mức chịu đựng của kết cấu địa chất địa phương vốn đã bị suy yếu do nạn chặt phá rừng đầu nguồn. Nguy cơ sạt lở đất và lũ quét ở mức báo động đỏ.",
      en: "The Northern mountainous region is experiencing unusually heavy rain due to climate change. The rainfall intensity exceeds the local geological structure's tolerance, which has been weakened by deforestation at the headwaters. The risk of landslides and flash floods is at a red alert level."
    },
    scientific_rules: {
      vi: "Trừ điểm nặng Ngân sách nếu sơ tán chậm hoặc thiệt hại nhân mạng. Cộng điểm Môi trường và Niềm tin nếu có kế hoạch trồng rừng phòng hộ và hệ thống cảnh báo sớm. Trừ điểm Năng lượng nếu điều động máy móc cứu hộ tiêu tốn nhiều nhiên liệu mà không hiệu quả. Điểm Niềm tin tăng mạnh nếu đảm bảo an toàn 100% tính mạng người dân.",
      en: "Severely deduct Budget if evacuation is slow or casualties occur. Add Environment and Trust points if there is a plan to plant protective forests and an early warning system. Deduct Energy if deploying rescue machinery consumes fuel inefficiently. Trust heavily increases if 100% safety of citizens is ensured."
    },
    severity: 3
  },
  {
    id: "EV_002",
    title: {
      vi: "BÁO ĐỘNG KHẨN: HẠN HÁN KỶ LỤC TẠI ĐỒNG BẰNG SÔNG HỒNG",
      en: "EMERGENCY: RECORD DROUGHT IN THE RED RIVER DELTA"
    },
    persona: {
      vi: "Người nông dân",
      en: "Farmer"
    },
    avatarUrl: "/avatars/farmer.png",
    description: {
      vi: "Trời ơi, lúa đang thời kỳ trổ bông mà nứt nẻ hết cả ruộng rồi! Hơn hai tháng nay không có một giọt mưa, các hồ chứa đều trơ đáy. Máy bơm cũng không đủ điện để chạy. Nếu không có nước cứu lúa trong tuần này, cả làng tôi sẽ mất trắng vụ mùa!",
      en: "Oh my god, the rice is in the blooming stage, but the fields are all cracked! Not a drop of rain for over two months, reservoirs are completely dry. The water pumps don't have enough electricity to run. If there's no water to save the rice this week, our entire village will lose the harvest!"
    },
    event_context: {
      vi: "Hệ thống sông Hồng đang đối mặt với mực nước thấp kỷ lục do hiện tượng El Nino kéo dài, kết hợp với việc các đập thủy điện ở thượng nguồn tích nước. Tình trạng thiếu hụt nước ngọt đang đe dọa nghiêm trọng an ninh lương thực và đời sống của hàng triệu người dân vùng đồng bằng.",
      en: "The Red River system is facing record low water levels due to a prolonged El Nino, combined with upstream hydroelectric dams storing water. The shortage of freshwater is seriously threatening food security and the lives of millions in the delta region."
    },
    scientific_rules: {
      vi: "Cộng điểm Ngân sách và Niềm tin nếu phân bổ nguồn nước hợp lý và hỗ trợ nông dân chuyển đổi cây trồng chịu hạn. Trừ điểm Môi trường nếu xúi giục khai thác nước ngầm quá mức gây sụt lún. Cộng điểm Năng lượng nếu áp dụng công nghệ tưới tiêu thông minh, tiết kiệm năng lượng. Trừ nặng Niềm tin nếu để xảy ra mất mùa trên diện rộng.",
      en: "Add Budget and Trust if water resources are rationally allocated and farmers are supported to switch to drought-resistant crops. Deduct Environment if excessive groundwater extraction is encouraged causing subsidence. Add Energy if smart, energy-saving irrigation tech is applied. Severely deduct Trust if widespread crop failure occurs."
    },
    severity: 2
  },
  {
    id: "EV_003",
    title: {
      vi: "MẤT ĐIỆN DIỆN RỘNG DO NẮNG NÓNG ĐỈNH ĐIỂM!",
      en: "WIDESPREAD POWER OUTAGE DUE TO EXTREME HEAT!"
    },
    persona: {
      vi: "Kỹ sư Điện lực",
      en: "Power Engineer"
    },
    avatarUrl: "/avatars/powerengineer.png",
    description: {
      vi: "Nhiệt độ ngoài trời đã vượt mức 42 độ C! Lượng tiêu thụ điện để làm mát tăng đột biến làm hệ thống lưới điện quá tải nghiêm trọng. Một số trạm biến áp đã phát nổ. Chúng tôi buộc phải cắt điện luân phiên, nhưng người già và bệnh nhân trong các khu vực mật độ dân số cao đang kiệt sức!",
      en: "Outdoor temperatures have exceeded 42°C! Electricity consumption for cooling has spiked, severely overloading the power grid. Some substations have exploded. We are forced to implement rolling blackouts, but the elderly and patients in high-density areas are exhausted!"
    },
    event_context: {
      vi: "Sóng nhiệt đô thị đang ở mức tồi tệ nhất trong vòng 50 năm qua. Hiệu ứng đảo nhiệt đô thị tại các thành phố lớn khiến nhiệt độ ban đêm không giảm nhiều, gây căng thẳng cực độ cho hệ thống điện lưới quốc gia và trực tiếp đe dọa sức khỏe cộng đồng.",
      en: "The urban heatwave is at its worst in 50 years. The urban heat island effect in major cities prevents nighttime temperatures from dropping much, causing extreme stress on the national power grid and directly threatening public health."
    },
    scientific_rules: {
      vi: "Trừ điểm Niềm tin nặng nề nếu để tình trạng mất điện diện rộng kéo dài, đặc biệt ảnh hưởng đến cơ sở y tế. Cộng điểm Năng lượng nếu triển khai thành công các nguồn điện năng lượng tái tạo khẩn cấp và chiến dịch tiết kiệm điện. Cộng điểm Môi trường nếu có kế hoạch phát triển không gian xanh đô thị để giảm hiệu ứng đảo nhiệt dài hạn. Trừ Ngân sách do chi phí khắc phục sự cố lưới điện.",
      en: "Heavily deduct Trust if widespread outages persist, especially affecting medical facilities. Add Energy if emergency renewable energy sources and power-saving campaigns are successfully deployed. Add Environment if there's a plan to develop urban green spaces to reduce long-term heat island effects. Deduct Budget due to grid repair costs."
    },
    severity: 3
  },
  {
    id: "EV_004",
    title: {
      vi: "KHÔNG KHÍ ĐỘC HẠI: CHỈ SỐ PM2.5 VƯỢT MỨC NGUY HIỂM!",
      en: "TOXIC AIR: PM2.5 EXCEEDS DANGEROUS LEVELS!"
    },
    persona: {
      vi: "Bác sĩ Hô hấp",
      en: "Respiratory Doctor"
    },
    avatarUrl: "/avatars/doctor.png",
    description: {
      vi: "Phòng cấp cứu của chúng tôi đã quá tải bệnh nhân hen suyễn và viêm phổi cấp! Màn sương mù dày đặc bao phủ thành phố mấy ngày nay thực chất là khói bụi độc hại. Trẻ em đang không thể đến trường. Chúng ta phải hành động ngay để cắt giảm nguồn phát thải từ các nhà máy và phương tiện giao thông!",
      en: "Our ER is overloaded with asthma and acute pneumonia patients! The dense fog blanketing the city for days is actually toxic smog. Children cannot go to school. We must act immediately to cut emissions from factories and transportation!"
    },
    event_context: {
      vi: "Hiện tượng nghịch nhiệt mùa đông kết hợp với lượng khí thải khổng lồ từ công nghiệp nặng và phương tiện giao thông cá nhân khiến bụi mịn PM2.5 bị giữ lại ở tầng thấp. Chỉ số ô nhiễm đã vượt tiêu chuẩn an toàn của WHO hơn 10 lần, gây nguy hại trực tiếp và cấp bách đến sinh mạng người dân.",
      en: "Winter temperature inversion combined with massive emissions from heavy industry and private vehicles traps PM2.5 at low altitudes. Pollution index has exceeded WHO safety standards by over 10 times, posing a direct and urgent threat to lives."
    },
    scientific_rules: {
      vi: "Cộng điểm Môi trường và Niềm tin lớn nếu ban hành chính sách hạn chế khẩn cấp phương tiện cá nhân và đình chỉ các nhà máy xả thải. Trừ mạnh Niềm tin và Ngân sách (do chi phí y tế tăng vọt) nếu không có cảnh báo và biện pháp y tế kịp thời. Tăng điểm Năng lượng và Môi trường nếu đẩy mạnh hệ thống giao thông công cộng chạy điện.",
      en: "Add large Environment and Trust points if emergency policies restricting private vehicles and suspending emitting factories are issued. Heavily deduct Trust and Budget (due to soaring medical costs) if no timely warnings and medical measures are taken. Increase Energy and Environment if electric public transit is promoted."
    },
    severity: 2
  },
  {
    id: "EV_005",
    title: {
      vi: "HIỂM HỌA XÂM NHẬP MẶN: NƯỚC SÔNG ĐÃ THÀNH NƯỚC BIỂN!",
      en: "SALTWATER INTRUSION THREAT: RIVER WATER TURNED TO SEAWATER!"
    },
    persona: {
      vi: "Kỹ sư Đê điều",
      en: "Dike Engineer"
    },
    avatarUrl: "/avatars/dikeengineer.png",
    description: {
      vi: "Nguy to rồi! Nước mặn đã lấn sâu vào nội đồng hơn 60km! Nguồn nước sinh hoạt của người dân đang bị nhiễm mặn nghiêm trọng, các trạm cấp nước không thể xử lý nổi. Vườn cây ăn trái lâu năm của bà con đang rụng lá và chết khô. Cần có giải pháp khẩn cấp để ngăn mặn ngay lập tức!",
      en: "Big trouble! Saltwater has intruded over 60km inland! Residential water sources are severely salinized, water stations can't process it. Farmers' perennial orchards are shedding leaves and dying. We need an urgent solution to stop the salinization immediately!"
    },
    event_context: {
      vi: "Do lưu lượng nước ngọt từ thượng nguồn sụt giảm nghiêm trọng trong mùa khô và hiện tượng nước biển dâng do biến đổi khí hậu, xâm nhập mặn đang diễn ra khốc liệt và sớm hơn dự kiến rất nhiều. Cơ sở hạ tầng thủy lợi hiện tại không đủ sức chống đỡ, đe dọa sinh kế và nguồn nước thiết yếu.",
      en: "Due to severely reduced upstream freshwater flow in the dry season and rising sea levels from climate change, saltwater intrusion is fierce and occurring much earlier than expected. Current irrigation infrastructure is insufficient, threatening livelihoods and essential water supplies."
    },
    scientific_rules: {
      vi: "Cộng điểm Ngân sách và Niềm tin nếu đầu tư xây dựng các đập ngăn mặn tạm thời và hỗ trợ cấp nước ngọt bằng xe bồn kịp thời. Cộng điểm Môi trường nếu đưa ra chiến lược chuyển đổi mô hình canh tác thích ứng với biến đổi khí hậu về lâu dài. Trừ rất mạnh Niềm tin nếu để người dân thiếu nước sinh hoạt trầm trọng. Trừ điểm Môi trường nếu xây đập bê tông bừa bãi làm phá vỡ hệ sinh thái tự nhiên.",
      en: "Add Budget and Trust if investing in temporary saltwater prevention dams and providing freshwater via trucks timely. Add Environment if a long-term climate-resilient farming strategy is provided. Heavily deduct Trust if citizens severely lack domestic water. Deduct Environment if indiscriminate concrete dams are built disrupting natural ecosystems."
    },
    severity: 3
  }
];

export function getRandomEvent(): GameEvent {
  const randomIndex = Math.floor(Math.random() * eventPool.length);
  return eventPool[randomIndex];
}
