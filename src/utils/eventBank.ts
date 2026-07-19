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

// ────────────────────────────────────────────────────────────────────────────
// Severity 1 — Cảnh Báo / Warning (minor issues, early indicators)
// ────────────────────────────────────────────────────────────────────────────
const severity1Events: GameEvent[] = [
    {
        id: "EV_006",
        title: {
            vi: "NỘI THÀNH HÀ NỘI NÓNG NHƯ ĐỔ LỬA!",
            en: "HANOI INNER CITY HEATWAVE!",
        },
        persona: {
            vi: "Nhà khí tượng học",
            en: "Meteorologist",
        },
        avatarUrl: "/avatars/meteorologist.png",
        description: {
            vi: "Đã nửa đêm nhưng nhiệt độ nội thành vẫn kẹt ở mức 33 độ C! Hơi nóng hầm hập phả lên từ các mặt đường nhựa và vách kính tòa nhà khiến người dân ngột ngạt, mất ngủ.",
            en: "It's midnight but the inner city temperature is stuck at 33°C! The stifling heat radiating from asphalt and glass walls is causing suffocating, sleepless nights.",
        },
        event_context: {
            vi: "Khu vực trung tâm đang hấp thụ và giữ nhiệt quá mức do mật độ bê tông hóa cao. Cần một cách nào đó để làm dịu bề mặt các công trình và trả lại không gian mát mẻ.",
            en: "The central area is over-absorbing and retaining heat due to high concretization. A way is needed to cool building surfaces and restore a cool environment.",
        },
        scientific_rules: {
            vi: "Cộng điểm Môi trường nếu người chơi đề xuất được các giải pháp phủ xanh (trồng cây, vườn trên mái) hoặc dùng vật liệu phản quang. Trừ điểm Năng lượng nếu họ chỉ đề xuất bật thêm điều hòa.",
            en: "Add Environment if the player suggests greening solutions (planting trees, green roofs) or reflective materials. Deduct Energy if they only suggest turning on more ACs.",
        },
        severity: 1,
    },
    {
        id: "EV_007",
        title: {
            vi: "BÁO ĐỘNG: RÁC THẢI BỐC MÙI VÀO KHU DÂN CƯ!",
            en: "ALERT: ODOROUS WASTE IN RESIDENTIAL AREA!",
        },
        persona: {
            vi: "Chuyên gia Môi trường",
            en: "Environmental Scientist",
        },
        avatarUrl: "/avatars/scientist.png",
        description: {
            vi: "Bãi tập kết rác tạm thời đang quá tải nghiêm trọng. Rác sinh hoạt chất đống không kịp xử lý, bốc mùi hôi thối nồng nặc bay thẳng vào khu dân cư lân cận khiến bà con vô cùng bức xúc.",
            en: "The temporary waste gathering site is severely overloaded. Unprocessed domestic waste is piling up, blowing a strong foul odor directly into the nearby residential area.",
        },
        event_context: {
            vi: "Lượng rác dồn ứ đang vượt qua công suất chở đi của xe gom. Cần một giải pháp xử lý lượng rác này nhanh chóng, hoặc một cách làm giảm lượng rác bị vứt ra bãi tập kết.",
            en: "The backlog of waste exceeds the capacity of collection trucks. A solution is needed to process this waste quickly, or a way to reduce the waste thrown at the site.",
        },
        scientific_rules: {
            vi: "Cộng điểm Môi trường nếu người chơi đưa ra giải pháp phân loại rác, ủ phân compost hữu cơ hoặc điện rác. Trừ Niềm tin nếu người chơi phớt lờ hoặc chỉ dồn rác sang khu vực khác.",
            en: "Add Environment if the player proposes waste sorting, organic composting, or waste-to-energy. Deduct Trust if they ignore it or just move waste elsewhere.",
        },
        severity: 1,
    },
    {
        id: "EV_008",
        title: {
            vi: "SÓNG BIỂN KHOÉT SÂU BỜ ĐÊ NAM ĐỊNH!",
            en: "WAVES ERODING NAM DINH DIKE!",
        },
        persona: {
            vi: "Kỹ sư Đê điều",
            en: "Dike Engineer",
        },
        avatarUrl: "/avatars/dikeengineer.png",
        description: {
            vi: "Sóng lớn đang liên tục đánh thẳng vào bờ biển Nam Định. Chỉ trong vài ngày, nước biển đã khoét sâu hàng mét đất, tiến sát đe dọa các đầm nuôi ngao của ngư dân.",
            en: "Large waves are continuously crashing into the Nam Dinh coast. In just days, seawater has eroded meters of land, directly threatening fishermen's clam farms.",
        },
        event_context: {
            vi: "Sóng vỗ đập trực tiếp vào bờ đất yếu do không có vùng đệm giảm chấn. Cần tạo ra một rào chắn để làm suy yếu lực của sóng trước khi chúng chạm đến bờ.",
            en: "Waves crash directly onto weak soil due to the lack of a buffer zone. A barrier is needed to weaken wave force before it reaches the shore.",
        },
        scientific_rules: {
            vi: "Cộng điểm Môi trường nếu người chơi chọn các giải pháp mềm như trồng rừng ngập mặn. Trừ Ngân sách nhiều nếu người chơi chỉ biết đổ bê tông làm kè cứng.",
            en: "Add Environment if the player chooses soft solutions like planting mangroves. Deduct Budget heavily if they only pour concrete for hard seawalls.",
        },
        severity: 1,
    },
    {
        id: "EV_009",
        title: {
            vi: "SÔNG HỒNG CẠN NƯỚC BẤT THƯỜNG!",
            en: "RED RIVER UNUSUALLY DRY!",
        },
        persona: {
            vi: "Đại diện Nông dân",
            en: "Farmer Representative",
        },
        avatarUrl: "/avatars/farmer.png",
        description: {
            vi: "Mới chớm mùa khô nhưng mực nước sông Hồng đã tụt thê thảm, lộ rõ cả ống hút của các trạm bơm thủy lợi. Nếu tình trạng này kéo dài, ruộng đồng sẽ nứt nẻ vì không lấy được nước.",
            en: "It's early dry season but the Red River water level has dropped drastically, exposing irrigation pump pipes. If this continues, fields will crack from lack of water.",
        },
        event_context: {
            vi: "Lượng nước tự nhiên sụt giảm làm các trạm bơm ven sông bị tê liệt. Phải tìm cách khác để đưa được nước vào ruộng hoặc thay đổi thói quen dùng nước sao cho phù hợp.",
            en: "The natural water drop paralyzed riverside pump stations. We must find another way to get water to fields or change water usage habits appropriately.",
        },
        scientific_rules: {
            vi: "Cộng điểm Ngân sách và Năng lượng nếu người chơi đưa ra giải pháp nạo vét kênh mương, bơm dã chiến hoặc chuyển đổi cây trồng ít nước. Trừ Niềm tin nếu phớt lờ để mặc nông dân.",
            en: "Add Budget and Energy if the player suggests dredging canals, field pumping, or low-water crops. Deduct Trust if ignoring farmers.",
        },
        severity: 1,
    },
    {
        id: "EV_010",
        title: {
            vi: "KHÓI BỤI BỦA VÂY KHU CÔNG TRƯỜNG!",
            en: "DUST CLOUDS AROUND CONSTRUCTION SITES!",
        },
        persona: {
            vi: "Bác sĩ Hô hấp",
            en: "Respiratory Doctor",
        },
        avatarUrl: "/avatars/doctor.png",
        description: {
            vi: "Tình trạng ho khan và dị ứng mắt ở trẻ nhỏ đang tăng đột biến tại các khu vực có dự án giao thông. Bụi mù xám xịt cuốn lên mù mịt mỗi khi có xe tải chạy qua.",
            en: "Dry coughs and eye allergies in children are spiking around traffic project areas. Gray dust clouds billow violently whenever trucks pass by.",
        },
        event_context: {
            vi: "Mặt đất khô hanh thiếu ẩm khiến bụi từ vật liệu và đất đá dễ dàng khuếch tán vào không khí. Cần một cách nào đó để dằn lớp bụi này xuống hoặc chặn chúng phát tán rộng hơn.",
            en: "Dry ground allows dust from materials and dirt to easily diffuse into the air. A way is needed to weigh this dust down or block its spread.",
        },
        scientific_rules: {
            vi: "Cộng điểm Môi trường nếu người chơi đề xuất các biện pháp che chắn công trình hoặc tăng cường độ ẩm mặt đường. Trừ Niềm tin nếu phớt lờ, để mặc người dân hứng bụi.",
            en: "Add Environment if the player proposes screening construction sites or increasing road surface moisture. Deduct Trust if ignoring and letting citizens breathe dust.",
        },
        severity: 1,
    },
    {
        id: "EV_011",
        title: {
            vi: "MƯA ĐẦU MÙA, PHỐ CỔ THÀNH SÔNG!",
            en: "EARLY RAIN, OLD QUARTER TURNED RIVER!",
        },
        persona: {
            vi: "Chuyên gia Môi trường",
            en: "Environmental Scientist",
        },
        avatarUrl: "/avatars/scientist.png",
        description: {
            vi: "Một cơn mưa dông lớn đổ xuống bất ngờ khiến nhiều tuyến phố trung tâm ngập sâu quá đầu gối. Nước rút cực kỳ chậm làm giao thông hỗn loạn, xe cộ chết máy la liệt.",
            en: "A sudden heavy thunderstorm flooded many central streets over knee-deep. Water is draining extremely slowly, causing traffic chaos and stalled vehicles.",
        },
        event_context: {
            vi: "Lượng nước dội xuống quá nhanh trong khi các miệng cống đã bị bít kín bởi túi nilon và rác vụn. Phải có giải pháp để nước tìm được đường thoát xuống hệ thống ngầm.",
            en: "Water pours down too fast while drain mouths are blocked by plastic bags and debris. A solution is needed for water to find its way into the underground system.",
        },
        scientific_rules: {
            vi: "Cộng điểm Môi trường và Niềm tin nếu đưa ra giải pháp khơi thông dòng chảy hoặc quản lý rác thải đầu nguồn. Trừ Ngân sách nếu phải tốn tiền điều xe hút nước khẩn cấp đắt đỏ.",
            en: "Add Environment and Trust if proposing clearing water flows or managing source waste. Deduct Budget if spending on expensive emergency pump trucks.",
        },
        severity: 1,
    },
    {
        id: "EV_012",
        title: {
            vi: "KHÓI MÙ MỊT CHE KHUẤT QUỐC LỘ!",
            en: "THICK SMOKE BLOCKS THE HIGHWAY!",
        },
        persona: {
            vi: "Chuyên gia Môi trường",
            en: "Environmental Scientist",
        },
        avatarUrl: "/avatars/scientist.png",
        description: {
            vi: "Đồng lúa vừa gặt xong, cứ đến chập tối là ngoại thành lại mù mịt khói trắng. Gió cuốn khói bay thẳng vào thành phố làm người dân cay xè mắt, ho sặc sụa. Tầm nhìn trên các tuyến quốc lộ giảm mạnh, rất nguy hiểm cho xe cộ.",
            en: "The rice harvest just finished, and every evening the outskirts are covered in white smoke. The wind blows the smoke straight into the city, making people's eyes sting and causing coughs. Visibility on highways has dropped sharply, posing a danger to traffic.",
        },
        event_context: {
            vi: "Để dọn dẹp đồng ruộng thật nhanh cho vụ mới, một thói quen lâu đời đang bị lạm dụng. Cần một cách khác để tận dụng khối lượng phụ phẩm nông nghiệp khổng lồ này thay vì cứ thế châm lửa đốt.",
            en: "To clear the fields quickly for the next crop, an age-old habit is being abused. Another way is needed to utilize this massive amount of agricultural byproduct instead of just setting it on fire.",
        },
        scientific_rules: {
            vi: "Cộng điểm Môi trường và Niềm tin nếu người chơi đề xuất thu gom phụ phẩm để trồng nấm, ủ phân hữu cơ hoặc làm thức ăn gia súc. Trừ Niềm tin nếu chỉ ra lệnh cấm đốt mà không hỗ trợ giải pháp thay thế.",
            en: "Add Environment and Trust if the player proposes collecting byproducts for mushroom farming, composting, or animal feed. Deduct Trust if merely issuing a burning ban without alternative solutions.",
        },
        severity: 1,
    },
];
// ────────────────────────────────────────────────────────────────────────────
// Severity 2 — Khẩn Cấp / Urgent (moderate climate events)
// ────────────────────────────────────────────────────────────────────────────
const severity2Events: GameEvent[] = [
    {
        id: "EV_002",
        title: {
            vi: "BÁO ĐỘNG KHẨN: HẠN HÁN KỶ LỤC TẠI ĐỒNG BẰNG SÔNG HỒNG",
            en: "EMERGENCY: RECORD DROUGHT IN THE RED RIVER DELTA",
        },
        persona: {
            vi: "Người nông dân",
            en: "Farmer",
        },
        avatarUrl: "/avatars/farmer.png",
        description: {
            vi: "Trời ơi, lúa đang thời kỳ trổ bông mà nứt nẻ hết cả ruộng rồi! Hơn hai tháng nay không có một giọt mưa, các hồ chứa đều trơ đáy. Máy bơm cũng không đủ điện để chạy. Nếu không có nước cứu lúa trong tuần này, cả làng tôi sẽ mất trắng vụ mùa!",
            en: "Oh my god, the rice is in the blooming stage, but the fields are all cracked! Not a drop of rain for over two months, reservoirs are completely dry. The water pumps don't have enough electricity to run. If there's no water to save the rice this week, our entire village will lose the harvest!",
        },
        event_context: {
            vi: "Hệ thống sông Hồng đang đối mặt với mực nước thấp kỷ lục do hiện tượng El Nino kéo dài, kết hợp với việc các đập thủy điện ở thượng nguồn tích nước. Tình trạng thiếu hụt nước ngọt đang đe dọa nghiêm trọng an ninh lương thực và đời sống của hàng triệu người dân vùng đồng bằng.",
            en: "The Red River system is facing record low water levels due to a prolonged El Nino, combined with upstream hydroelectric dams storing water. The shortage of freshwater is seriously threatening food security and the lives of millions in the delta region.",
        },
        scientific_rules: {
            vi: "Cộng điểm Ngân sách và Niềm tin nếu phân bổ nguồn nước hợp lý và hỗ trợ nông dân chuyển đổi cây trồng chịu hạn. Trừ điểm Môi trường nếu xúi giục khai thác nước ngầm quá mức gây sụt lún. Cộng điểm Năng lượng nếu áp dụng công nghệ tưới tiêu thông minh, tiết kiệm năng lượng. Trừ nặng Niềm tin nếu để xảy ra mất mùa trên diện rộng.",
            en: "Add Budget and Trust if water resources are rationally allocated and farmers are supported to switch to drought-resistant crops. Deduct Environment if excessive groundwater extraction is encouraged causing subsidence. Add Energy if smart, energy-saving irrigation tech is applied. Severely deduct Trust if widespread crop failure occurs.",
        },
        severity: 2,
    },
    {
        id: "EV_004",
        title: {
            vi: "KHÔNG KHÍ ĐỘC HẠI: CHỈ SỐ PM2.5 VƯỢT MỨC NGUY HIỂM!",
            en: "TOXIC AIR: PM2.5 EXCEEDS DANGEROUS LEVELS!",
        },
        persona: {
            vi: "Bác sĩ Hô hấp",
            en: "Respiratory Doctor",
        },
        avatarUrl: "/avatars/doctor.png",
        description: {
            vi: "Phòng cấp cứu của chúng tôi đã quá tải bệnh nhân hen suyễn và viêm phổi cấp! Màn sương mù dày đặc bao phủ thành phố mấy ngày nay thực chất là khói bụi độc hại. Trẻ em đang không thể đến trường. Chúng ta phải hành động ngay để cắt giảm nguồn phát thải từ các nhà máy và phương tiện giao thông!",
            en: "Our ER is overloaded with asthma and acute pneumonia patients! The dense fog blanketing the city for days is actually toxic smog. Children cannot go to school. We must act immediately to cut emissions from factories and transportation!",
        },
        event_context: {
            vi: "Hiện tượng nghịch nhiệt mùa đông kết hợp với lượng khí thải khổng lồ từ công nghiệp nặng và phương tiện giao thông cá nhân khiến bụi mịn PM2.5 bị giữ lại ở tầng thấp. Chỉ số ô nhiễm đã vượt tiêu chuẩn an toàn của WHO hơn 10 lần, gây nguy hại trực tiếp và cấp bách đến sinh mạng người dân.",
            en: "Winter temperature inversion combined with massive emissions from heavy industry and private vehicles traps PM2.5 at low altitudes. Pollution index has exceeded WHO safety standards by over 10 times, posing a direct and urgent threat to lives.",
        },
        scientific_rules: {
            vi: "Cộng điểm Môi trường và Niềm tin lớn nếu ban hành chính sách hạn chế khẩn cấp phương tiện cá nhân và đình chỉ các nhà máy xả thải. Trừ mạnh Niềm tin và Ngân sách (do chi phí y tế tăng vọt) nếu không có cảnh báo và biện pháp y tế kịp thời. Tăng điểm Năng lượng và Môi trường nếu đẩy mạnh hệ thống giao thông công cộng chạy điện.",
            en: "Add large Environment and Trust points if emergency policies restricting private vehicles and suspending emitting factories are issued. Heavily deduct Trust and Budget (due to soaring medical costs) if no timely warnings and medical measures are taken. Increase Energy and Environment if electric public transit is promoted.",
        },
        severity: 2,
    },
    {
        id: "EV_013",
        title: {
            vi: "BÁO ĐỘNG SỤT LÚN: NHÀ DÂN NỨT TƯỜNG, NGHIÊNG NGẢ!",
            en: "SUBSIDENCE ALERT: CRACKED WALLS, TILTING HOUSES!",
        },
        persona: {
            vi: "Chuyên gia Môi trường",
            en: "Environmental Scientist",
        },
        avatarUrl: "/avatars/scientist.png",
        description: {
            vi: "Nhiều khu vực ở ngoại thành Hà Nội đang kêu cứu vì nền đất sụt lún nghiêm trọng. Vỉa hè nứt toác, nhiều ngôi nhà cấp 4 bỗng nhiên bị nghiêng hẳn sang một bên, cửa ra vào không thể đóng mở được. Nguy cơ đổ sập là rất cao nếu tình trạng này tiếp diễn!",
            en: "Many suburban areas in Hanoi are crying for help due to severe land subsidence. Sidewalks are cracked, and several houses have suddenly tilted to one side, unable to open or close their doors. The risk of collapse is very high if this continues!",
        },
        event_context: {
            vi: "Việc khai thác một nguồn tài nguyên nằm sâu dưới lòng đất quá mức trong hàng chục năm qua đã làm rỗng các túi địa chất bên dưới. Cần phải thiết lập lại nguồn cung cấp thay thế trên mặt đất để ngừng việc 'hút cạn' này.",
            en: "Over-extracting a resource deep underground for decades has emptied the geological pockets below. A surface alternative supply must be established to stop this 'draining'.",
        },
        scientific_rules: {
            vi: "Cộng điểm Môi trường và Niềm tin nếu người chơi quyết định đóng cửa các giếng khoan ngầm và đầu tư mạng lưới nước mặt. Trừ nặng Ngân sách nếu chỉ đi đền bù thiệt hại nhà cửa mà không giải quyết tận gốc.",
            en: "Add Environment and Trust if the player decides to close groundwater wells and invest in surface water networks. Heavily deduct Budget if only compensating for house damages without tackling the root cause.",
        },
        severity: 2,
    },
    {
        id: "EV_014",
        title: {
            vi: "DÒNG SÔNG ĐEN NGÒM, BỐC MÙI HÓA CHẤT TỔNG HỢP!",
            en: "BLACK RIVER, SYNTHETIC CHEMICAL STENCH!",
        },
        persona: {
            vi: "Trưởng thôn",
            en: "Village Chief",
        },
        avatarUrl: "/avatars/villagechef.png",
        description: {
            vi: "Toàn bộ đoạn sông Nhuệ chảy qua xã tôi sáng nay bỗng chuyển màu đen đặc như mực. Mùi hóa chất bốc lên nồng nặc khiến ai ngửi cũng buồn nôn, chóng mặt. Cá chết nổi trắng bụng dạt kín hai bên bờ. Không ai dám lấy nước để tưới tiêu nữa!",
            en: "The entire section of the Nhue river flowing through my commune suddenly turned pitch black like ink this morning. The strong chemical stench makes everyone nauseous. Dead fish are floating belly-up along both banks. No one dares to use the water for irrigation anymore!",
        },
        event_context: {
            vi: "Dấu hiệu này cho thấy một lượng lớn chất độc hại chưa qua xử lý vừa bị tống thẳng ra môi trường tự nhiên. Phải có biện pháp truy vết nguồn gốc và ngăn chặn ngay lập tức hành vi xả thải lén lút này.",
            en: "This indicates a massive amount of untreated toxic substances was just dumped into the natural environment. Measures must be taken to trace the source and immediately stop this illegal discharge.",
        },
        scientific_rules: {
            vi: "Cộng mạnh điểm Môi trường và Niềm tin nếu người chơi cử đoàn thanh tra đột xuất các cụm công nghiệp ven sông và xử phạt nghiêm. Trừ mạnh Niềm tin và sức khỏe cộng đồng nếu phớt lờ báo cáo của người dân.",
            en: "Heavily add Environment and Trust if the player dispatches surprise inspections to riverside industrial clusters and imposes strict fines. Heavily deduct Trust and public health if ignoring citizens' reports.",
        },
        severity: 2,
    },
    {
        id: "EV_015",
        title: {
            vi: "DỊCH BỆNH BÙNG PHÁT SAU NHỮNG TRẬN MƯA THẤT THƯỜNG!",
            en: "DISEASE OUTBREAK AFTER ERRATIC RAINS!",
        },
        persona: {
            vi: "Bác sĩ Hô hấp",
            en: "Respiratory Doctor", // Dùng avatar bác sĩ vì liên quan tới y tế
        },
        avatarUrl: "/avatars/doctor.png",
        description: {
            vi: "Số ca nhập viện vì sốt cao, xuất huyết và suy kiệt đang tăng theo cấp số nhân trong tuần qua. Các hành lang bệnh viện tuyến huyện đã chật kín giường gấp. Thời tiết nắng mưa xen kẽ liên tục đang tạo điều kiện lý tưởng cho mầm bệnh lây lan khắp các khu dân cư đông đúc.",
            en: "Hospital admissions for high fever, bleeding, and exhaustion have grown exponentially over the past week. District hospital corridors are packed with folding beds. The constant alternating sun and rain create ideal conditions for pathogens to spread across dense residential areas.",
        },
        event_context: {
            vi: "Nước đọng lại tại các phế liệu, công trường và kênh rạch sau mưa đang trở thành lò ấp khổng lồ cho vật trung gian truyền bệnh. Thay vì chỉ chữa trị phần ngọn, cần phải dập tắt môi trường sinh sôi của chúng.",
            en: "Stagnant water in scrap materials, construction sites, and canals after rain has become a giant incubator for disease vectors. Instead of just treating the symptoms, their breeding grounds must be eradicated.",
        },
        scientific_rules: {
            vi: "Cộng điểm Niềm tin và Môi trường nếu người chơi phát động chiến dịch tổng vệ sinh diệt loăng quăng, bọ gậy và phun thuốc diện rộng. Trừ Ngân sách y tế rất nặng nếu chỉ lo tăng cường giường bệnh mà bỏ qua khâu phòng dịch.",
            en: "Add Trust and Environment if the player launches a massive cleanup campaign to clear larvae and conduct widespread spraying. Heavily deduct Health Budget if only increasing hospital beds while ignoring prevention.",
        },
        severity: 2,
    },
    {
        id: "EV_016",
        title: {
            vi: "MƯA LỚN DỒN DẬP: HOA MÀU CHÌM TRONG BIỂN NƯỚC!",
            en: "HEAVY DOWNPOURS: CROPS SUBMERGED IN WATER!",
        },
        persona: {
            vi: "Đại diện Nông dân",
            en: "Farmer Representative",
        },
        avatarUrl: "/avatars/farmer.png",
        description: {
            vi: "Trời đổ mưa xối xả không ngừng suốt 2 ngày đêm! Hàng ngàn héc-ta lúa nếp và rau màu vụ đông chuẩn bị thu hoạch ở Hưng Yên, Hà Nam đã ngập trắng băng. Nước rút quá chậm, nếu ngâm thêm một ngày nữa thì rễ sẽ thối và coi như mất trắng!",
            en: "It has been pouring relentlessly for 2 days and nights! Thousands of hectares of winter sticky rice and vegetables ready for harvest in Hung Yen and Ha Nam are completely submerged. The water is draining too slowly; one more day of soaking, the roots will rot and it's a total loss!",
        },
        event_context: {
            vi: "Lượng mưa vượt quá thiết kế tiêu thoát tự nhiên của hệ thống kênh mương nội đồng. Cần một sự can thiệp mạnh mẽ bằng máy móc để ép lượng nước này chảy ra các sông lớn trước khi quá muộn.",
            en: "Rainfall has exceeded the natural drainage design of the field canal system. Strong mechanical intervention is needed to force this water out to major rivers before it's too late.",
        },
        scientific_rules: {
            vi: "Cộng điểm Ngân sách và Năng lượng nếu người chơi quyết định dồn điện chạy tối đa các trạm bơm tiêu úng công suất lớn. Trừ mạnh Niềm tin và Ngân sách (do mất mùa) nếu để mặc nước tự rút.",
            en: "Add Budget and Energy if the player decides to divert maximum power to run high-capacity drainage pumping stations. Heavily deduct Trust and Budget (due to crop failure) if letting the water drain naturally.",
        },
        severity: 2,
    },
];

// ────────────────────────────────────────────────────────────────────────────
// Severity 3 — Nguy Cấp / Critical (severe disasters)
// ────────────────────────────────────────────────────────────────────────────
const severity3Events: GameEvent[] = [
    {
        id: "EV_001",
        title: {
            vi: "CẢNH BÁO LŨ QUÉT VÀ SẠT LỞ ĐẤT DIỆN RỘNG!",
            en: "WARNING: WIDESPREAD FLASH FLOODS AND LANDSLIDES!",
        },
        persona: {
            vi: "Trưởng bản",
            en: "Village Chief",
        },
        avatarUrl: "/avatars/villagechef.png",
        description: {
            vi: "Cứu chúng tôi với! Mưa lớn liên tục ba ngày nay khiến đất đá từ trên đồi có nguy cơ sạt lở bất cứ lúc nào. Nước suối dâng cao cuồn cuộn, một số căn nhà ở vùng trũng đã bị cuốn trôi. Xin hãy lập tức có biện pháp sơ tán người dân và gia cố sườn đồi trước khi quá muộn!",
            en: "Help us! Heavy rains for three consecutive days have put rocks on the hills at risk of landslides at any time. The stream water is rising rapidly, and some houses in low-lying areas have been washed away. Please immediately evacuate the people and reinforce the hillside before it's too late!",
        },
        event_context: {
            vi: "Khu vực miền núi phía Bắc đang trải qua đợt mưa lớn bất thường do biến đổi khí hậu. Cường độ mưa vượt quá mức chịu đựng của kết cấu địa chất địa phương vốn đã bị suy yếu do nạn chặt phá rừng đầu nguồn. Nguy cơ sạt lở đất và lũ quét ở mức báo động đỏ.",
            en: "The Northern mountainous region is experiencing unusually heavy rain due to climate change. The rainfall intensity exceeds the local geological structure's tolerance, which has been weakened by deforestation at the headwaters. The risk of landslides and flash floods is at a red alert level.",
        },
        scientific_rules: {
            vi: "Trừ điểm nặng Ngân sách nếu sơ tán chậm hoặc thiệt hại nhân mạng. Cộng điểm Môi trường và Niềm tin nếu có kế hoạch trồng rừng phòng hộ và hệ thống cảnh báo sớm. Trừ điểm Năng lượng nếu điều động máy móc cứu hộ tiêu tốn nhiều nhiên liệu mà không hiệu quả. Điểm Niềm tin tăng mạnh nếu đảm bảo an toàn 100% tính mạng người dân.",
            en: "Severely deduct Budget if evacuation is slow or casualties occur. Add Environment and Trust points if there is a plan to plant protective forests and an early warning system. Deduct Energy if deploying rescue machinery consumes fuel inefficiently. Trust heavily increases if 100% safety of citizens is ensured.",
        },
        severity: 3,
    },
    {
        id: "EV_003",
        title: {
            vi: "MẤT ĐIỆN DIỆN RỘNG DO NẮNG NÓNG ĐỈNH ĐIỂM!",
            en: "WIDESPREAD POWER OUTAGE DUE TO EXTREME HEAT!",
        },
        persona: {
            vi: "Kỹ sư Điện lực",
            en: "Power Engineer",
        },
        avatarUrl: "/avatars/powerengineer.png",
        description: {
            vi: "Nhiệt độ ngoài trời đã vượt mức 42 độ C! Lượng tiêu thụ điện để làm mát tăng đột biến làm hệ thống lưới điện quá tải nghiêm trọng. Một số trạm biến áp đã phát nổ. Chúng tôi buộc phải cắt điện luân phiên, nhưng người già và bệnh nhân trong các khu vực mật độ dân số cao đang kiệt sức!",
            en: "Outdoor temperatures have exceeded 42°C! Electricity consumption for cooling has spiked, severely overloading the power grid. Some substations have exploded. We are forced to implement rolling blackouts, but the elderly and patients in high-density areas are exhausted!",
        },
        event_context: {
            vi: "Sóng nhiệt đô thị đang ở mức tồi tệ nhất trong vòng 50 năm qua. Hiệu ứng đảo nhiệt đô thị tại các thành phố lớn khiến nhiệt độ ban đêm không giảm nhiều, gây căng thẳng cực độ cho hệ thống điện lưới quốc gia và trực tiếp đe dọa sức khỏe cộng đồng.",
            en: "The urban heatwave is at its worst in 50 years. The urban heat island effect in major cities prevents nighttime temperatures from dropping much, causing extreme stress on the national power grid and directly threatening public health.",
        },
        scientific_rules: {
            vi: "Trừ điểm Niềm tin nặng nề nếu để tình trạng mất điện diện rộng kéo dài, đặc biệt ảnh hưởng đến cơ sở y tế. Cộng điểm Năng lượng nếu triển khai thành công các nguồn điện năng lượng tái tạo khẩn cấp và chiến dịch tiết kiệm điện. Cộng điểm Môi trường nếu có kế hoạch phát triển không gian xanh đô thị để giảm hiệu ứng đảo nhiệt dài hạn. Trừ Ngân sách do chi phí khắc phục sự cố lưới điện.",
            en: "Heavily deduct Trust if widespread outages persist, especially affecting medical facilities. Add Energy if emergency renewable energy sources and power-saving campaigns are successfully deployed. Add Environment if there's a plan to develop urban green spaces to reduce long-term heat island effects. Deduct Budget due to grid repair costs.",
        },
        severity: 3,
    },
    {
        id: "EV_005",
        title: {
            vi: "HIỂM HỌA XÂM NHẬP MẶN: NƯỚC SÔNG ĐÃ THÀNH NƯỚC BIỂN!",
            en: "SALTWATER INTRUSION THREAT: RIVER WATER TURNED TO SEAWATER!",
        },
        persona: {
            vi: "Kỹ sư Đê điều",
            en: "Dike Engineer",
        },
        avatarUrl: "/avatars/dikeengineer.png",
        description: {
            vi: "Nguy to rồi! Nước mặn đã lấn sâu vào nội đồng hơn 60km! Nguồn nước sinh hoạt của người dân đang bị nhiễm mặn nghiêm trọng, các trạm cấp nước không thể xử lý nổi. Vườn cây ăn trái lâu năm của bà con đang rụng lá và chết khô. Cần có giải pháp khẩn cấp để ngăn mặn ngay lập tức!",
            en: "Big trouble! Saltwater has intruded over 60km inland! Residential water sources are severely salinized, water stations can't process it. Farmers' perennial orchards are shedding leaves and dying. We need an urgent solution to stop the salinization immediately!",
        },
        event_context: {
            vi: "Do lưu lượng nước ngọt từ thượng nguồn sụt giảm nghiêm trọng trong mùa khô và hiện tượng nước biển dâng do biến đổi khí hậu, xâm nhập mặn đang diễn ra khốc liệt và sớm hơn dự kiến rất nhiều. Cơ sở hạ tầng thủy lợi hiện tại không đủ sức chống đỡ, đe dọa sinh kế và nguồn nước thiết yếu.",
            en: "Due to severely reduced upstream freshwater flow in the dry season and rising sea levels from climate change, saltwater intrusion is fierce and occurring much earlier than expected. Current irrigation infrastructure is insufficient, threatening livelihoods and essential water supplies.",
        },
        scientific_rules: {
            vi: "Cộng điểm Ngân sách và Niềm tin nếu đầu tư xây dựng các đập ngăn mặn tạm thời và hỗ trợ cấp nước ngọt bằng xe bồn kịp thời. Cộng điểm Môi trường nếu đưa ra chiến lược chuyển đổi mô hình canh tác thích ứng với biến đổi khí hậu về lâu dài. Trừ rất mạnh Niềm tin nếu để người dân thiếu nước sinh hoạt trầm trọng. Trừ điểm Môi trường nếu xây đập bê tông bừa bãi làm phá vỡ hệ sinh thái tự nhiên.",
            en: "Add Budget and Trust if investing in temporary saltwater prevention dams and providing freshwater via trucks timely. Add Environment if a long-term climate-resilient farming strategy is provided. Heavily deduct Trust if citizens severely lack domestic water. Deduct Environment if indiscriminate concrete dams are built disrupting natural ecosystems.",
        },
        severity: 3,
    },
];

// ────────────────────────────────────────────────────────────────────────────
// Re-export the original eventPool for backward compatibility
// ────────────────────────────────────────────────────────────────────────────
export const eventPool: GameEvent[] = [...severity1Events, ...severity2Events, ...severity3Events];

// ────────────────────────────────────────────────────────────────────────────
// Grouped events by severity — used by the round-based selection system
// ────────────────────────────────────────────────────────────────────────────
export const eventsBySeverity: Record<number, GameEvent[]> = {
    1: severity1Events,
    2: severity2Events,
    3: severity3Events,
};

// ────────────────────────────────────────────────────────────────────────────
// Random event selection with no-duplicate tracking
// ────────────────────────────────────────────────────────────────────────────
export function getRandomEventBySeverity(
    severity: 1 | 2 | 3,
    usedEventIds: Set<string>,
): GameEvent {
    const pool = eventsBySeverity[severity];
    const available = pool.filter((event) => !usedEventIds.has(event.id));

    // If there are still unused events, pick from them
    if (available.length > 0) {
        const randomIndex = Math.floor(Math.random() * available.length);
        return available[randomIndex];
    }

    // Safety fallback: all events for this severity have been used,
    // pick randomly from the full severity pool
    const randomIndex = Math.floor(Math.random() * pool.length);
    return pool[randomIndex];
}

// ────────────────────────────────────────────────────────────────────────────
// Legacy function — kept for backward compatibility
// ────────────────────────────────────────────────────────────────────────────
export function getRandomEvent(): GameEvent {
    const randomIndex = Math.floor(Math.random() * eventPool.length);
    return eventPool[randomIndex];
}
