/** @format */

import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
const productImageId = uuidv4()
const data = {
  users: [
    {
      name : "admin",
      email: "admin@gmail.com",
      password: bcrypt.hashSync("1234", 8),
      isAdmin: true,
      numberPhone: "0375197640",
      gender: "Nam",
      birthday: "01/01/1999"
    },
    {
      name: "Anh Nhựt",
      email: "anhnhut@gmail.com",
      password: bcrypt.hashSync("1234", 8),
      isAdmin: true,
    },
  ],
  products: [
    {
      name: "Quần Jogger BOUTON With Zipper",
      category: "Quần Jogger",
      images: [
        {
          id: productImageId,
          url: "/images/product-1/p1.jpg",
        },
        {
          id: productImageId,
          url: "/images/product-1/p1-2.jpg",
        },
        {
          id: productImageId,
          url: "/images/product-1/p1-3.jpg",
        },
        {
          id: productImageId,
          url: "/images/product-1/p1-4.jpg",
        },
        {
          id: productImageId,
          url: "/images/product-1/p1-5.jpg",
        },
      ],
      price: 280000,
      countInStock: 10,
      rating: 4.5,
      numReviews: 10,
      description:
        " Pique Jogger BOUTON With Zipper // dòng quần jogger vải pique là mẫu mới lên kệ trong năm nay của BOUTON.Form slim, chất vải pique là dòng bán chạy nhất luôn ",
      colors: ["#000", "gray"],
      size: ["S", "M", "L", "XL"],
      newArrivals: true,
    },
    {
      name: "Áo Thun BOUTON Authletics Striped",
      category: "Áo Thun",
      images: [
        {
          id: productImageId,
          url: "/images/product-2/p2.jpg",
        },
        {
          id: productImageId,
          url: "/images/product-2/p2-2.jpg",
        },
        {
          id: productImageId,
          url: "/images/product-2/p2-3.jpg",
        },
        {
          id: productImageId,
          url: "/images/product-2/p2-2.jpg",
        },
        {
          id: productImageId,
          url: "/images/product-2/p2-5.jpg",
        },
      ],
      price: 224000,
      countInStock: 20,
      rating: 4.0,
      numReviews: 10,
      description:
        "Dòng college athletics BOUTON 2021 mới nhất vừa lên kệ nha ae. Chất vải cotton 100%, mịn mát. Form slim.",
      colors: ["#000", "#f2f2f2"],
      size: ["S", "M", "L", "XL"],
      newArrivals: true,
    },
    {
      name: "Áo Thun BOUTON Prime Acid Wash",
      category: "Áo Thun",
      images: [
        {
          id: productImageId,
          url: "/images/product-3/p3.jpg",
        },
        {
          id: productImageId,
          url: "/images/product-3/p3-2.jpg",
        },
        {
          id: productImageId,
          url: "/images/product-3/p3-3.jpg",
        },
      ],
      price: 222000,
      countInStock: 18,
      rating: 5,
      numReviews: 17,
      description:
        "Màu sắc mới mẻ, sang trọng. Chất liệu vải mềm, bền bỉ và thoáng mát.",
      colors: ["#000", "gray"],
      size: ["XS","S", "M", "L", "XL"],
      newArrivals: true,
    },
    {
      name: "Áo polo BOUTON printed",
      category: "Áo Thun",
      images: [
        {
          id: productImageId,
          url: "/images/product-4/p4.jpg",
        },
        {
          id: productImageId,
          url: "/images/product-4/p4-2.jpg",
        },
        {
          id: productImageId,
          url: "/images/product-4/p4-3.jpg",
        },
      ],
      price: 380000,
      countInStock: 15,
      rating: 4.5,
      numReviews: 14,
      description:
        "Đợt này BOUTON lên kệ dòng polo in full áo khá chất nha ae. Chất vải cá sấu thấm hút mồ hôi tốt, thoáng mát có thể mặc đi làm hay ở nhà đều được. Form slim.",
      colors: ["#000", "pink"],
      size: ["S", "M", "L", "XL"],
      newArrivals: true,
    },
    {
      name: "Áo Sơmi Caro BOUTON Flannel",
      category: "Áo Thun",
      images: [
        {
          id: productImageId,
          url: "/images/product-5/p5.jpg",
        },
        {
          id: productImageId,
          url: "/images/product-5/p5-2.jpg",
        },
        {
          id: productImageId,
          url: "/images/product-5/p5-3.jpg",
        },
        {
          id: productImageId,
          url: "/images/product-5/p5-4.jpg",
        },
        {
          id: productImageId,
          url: "/images/product-5/p5-5.jpg",
        },
        {
          id: productImageId,
          url: "/images/product-5/p5-6.jpg",
        },
      ],
      price: 256000,
      countInStock: 5,
      rating: 4.5,
      numReviews: 10,
      description:
        "Flannel Shirt BOUTON. Dòng sơmi vải caro flannel vừa mới lên kệ phục vụ ae 👌🏻. Form slim. Chất vải cotton mềm mịn, mặc mùa hè khá thoải mái. 3 màu khá đẹp, ae mặc trong hay khoác ngoài đều phù hợp nha 👍🏻",
      colors: ["green", "red", "yellow"],
      size: ["S", "M", "L", "XL"],
      newArrivals: true,
    },
    {
      name: "Áo hoodie BOUTON basic ss21",
      category: "Áo Hoodie",
      images: [
        {
          id: productImageId,
          url: "/images/product-6/p6.jpg",
        },
        {
          id: productImageId,
          url: "/images/product-6/p6-2.jpg",
        },
        {
          id: productImageId,
          url: "/images/product-6/p6-3.jpg",
        },
        {
          id: productImageId,
          url: "/images/product-6/p6-4.jpg",
        },
        {
          id: productImageId,
          url: "/images/product-6/p6-5.jpg",
        },
        {
          id: productImageId,
          url: "/images/product-6/p6-6.jpg",
        },
      ],
      price: 304000,
      countInStock: 12,
      rating: 4.5,
      numReviews: 15,
      description:
        "Basic hoodie BOUTON 2021, dòng hoodie mới nhất của BOUTON năm nay. Chất vải nỉ cotton 100 tone màu siêu đẹp. Hàng full tem, tag,...",
      colors: ["#000", "orange", "yellow", "#f2f2f2"],
      size: ["S", "M", "L", "XL"],
      newArrivals: true,
    },

    {
      name: "Quần Short BOUTON Acid wash",
      category: "Quần Short",
      images: [
        {
          id: productImageId,
          url: "/images/product-7/p7.jpg",
        },
        {
          id: productImageId,
          url: "/images/product-7/p7-2.jpg",
        },
        {
          id: productImageId,
          url: "/images/product-7/p7-3.jpg",
        },
        {
          id: productImageId,
          url: "/images/product-7/p7-4.jpg",
        },
      ],
      price: 256000,
      countInStock: 12,
      rating: 3.5,
      numReviews: 15,
      description:
        "Washed Cargo Shorts BOUTON. Lên kệ dòng quần nỉ túi hộp wash cho hiệu ứng cực chất. Dáng ngang gối, lên style streetwear hợp lý luôn. Duy nhất màu xám đen wash.",
      colors: ["#2B2A2F"],
      size: ["S", "M", "L", "XL"],
      newArrivals: true,
    },
    {
      name: "Quần Short Jeans BOUTON Light Blue Skinny",
      category: "Quần Short",

      images: [
        {
          id: productImageId,
          url: "/images/product-8/p8.jpg",
        },
        {
          id: productImageId,
          url: "/images/product-8/p8-2.jpg",
        },
        {
          id: productImageId,
          url: "/images/product-8/p8-3.jpg",
        },
        {
          id: productImageId,
          url: "/images/product-8/p8-4.jpg",
        },
        {
          id: productImageId,
          url: "/images/product-8/p8-5.jpg",
        },
      ],
      price: 280000,
      countInStock: 0,
      rating: 4.5,
      numReviews: 15,
      description:
        "BOUTON Ripped Denim Shorts // dòng quần short mới nhất của BOUTON vừa lên kệ . Mẫu đợt này bụi & chất lắm nha ae, màu light blue mix đồ khá trẻ trung. Form slim fit, dáng ngang gối.",
      colors: ["#2B2A2F"],
      size: ["S", "M", "L", "XL"],
      newArrivals: false,
    },
    {
      name: "Quần jeans NOMOUS ESSENTIALS light grey super skinny",
      category: "Quần Jeans",
      images: [
        {
          id: productImageId,
          url: "/images/product-9/p9.jpg",
        },
        {
          id: productImageId,
          url: "/images/product-9/p9-2.jpg",
        },
        {
          id: productImageId,
          url: "/images/product-9/p9-3.jpg",
        },
        {
          id: productImageId,
          url: "/images/product-9/p9-4.jpg",
        },
      ],
      price: 400000,
      countInStock: 12,
      rating: 4.8,
      numReviews: 15,
      description:
        "NOMOUS ESSENTIALS Light Grey Wash Jeans. Dòng quần jeans wash màu xám bạc vừa lên kệ phục. Form super skinny ôm dáng cực đẹp & trẻ trung.Chất vải jean mềm, co giãn nên mặc rất thoải mái ",
      colors: ["#ADADAD"],
      size: ["S", "M", "L", "XL"],
      newArrivals: false,
    },
    {
      name: "Áo khoác denim BOUTON Panda",
      category: "Áo Khoác",
      images: [
        {
          id: productImageId,
          url: "/images/product-10/p10.jpg",
        },
        {
          id: productImageId,
          url: "/images/product-10/p10-2.jpg",
        },
        {
          id: productImageId,
          url: "/images/product-10/p10-3.jpg",
        },
        {
          id: productImageId,
          url: "/images/product-10/p10-4.jpg",
        },
      ],
      price: 300000,
      countInStock: 12,
      rating: 4.1,
      numReviews: 7,
      description:
        "NOMOUS ESSENTIALS Light Grey Wash Jeans. Dòng quần jeans wash màu xám bạc vừa lên kệ phục. Form super skinny ôm dáng cực đẹp & trẻ trung.Chất vải jean mềm, co giãn nên mặc rất thoải mái ",
      colors: ["#000000"],
      size: ["S", "M", "L", "XL"],
      newArrivals: false,
    },
    {
      name: "Quần jogger BOUTON phối nút",
      category: "Quần Jogger",
      images: [
        {
          id: productImageId,
          url: "/images/product-11/p11.jpg",
        },
        {
          id: productImageId,
          url: "/images/product-11/p11-2.jpg",
        },
        {
          id: productImageId,
          url: "/images/product-11/p11-3.jpg",
        },
        {
          id: productImageId,
          url: "/images/product-11/p11-4.jpg",
        },
      ],
      price: 330000,
      countInStock: 19,
      rating: 5,
      numReviews: 17,
      description:
        "Chất vải thun nỉ mặc rất thoải mái. Form ngang mắt cá nên ae mang với sneakers là chuẩn luôn",
      colors: ["#000000"],
      size: ["S", "M", "L", "XL"],
      newArrivals: true,
    },
    {
      name: "Quần dài NOMOUS ESSENTIALS linen",
      category: "Quần Jogger",
      images: [
        {
          id: productImageId,
          url: "/images/product-12/p12.jpg",
        },
        {
          id: productImageId,
          url: "/images/product-12/p12-2.jpg",
        },
        {
          id: productImageId,
          url: "/images/product-12/p12-3.jpg",
        },
        {
          id: productImageId,
          url: "/images/product-12/p12-4.jpg",
        },
      ],
      price: 266000,
      countInStock: 10,
      rating: 4,
      numReviews: 50,
      description:
        "Quần dài linen NOMOUS ss21 lưng thun khá tiện & thoải mái nha ae. Chất liệu vải linen có thun, form slim.",
      colors: ["#000000", "#808080"],
      size: ["S", "M", "L"],
      newArrivals: false,
    },
    {
      name: "Quần tây NOMOUS ESSENTIALS w Embroidery Pattern",
      category: "Quần Tây",
      images: [
        {
          id: productImageId,
          url: "/images/product-13/p13.jpg",
        },
        {
          id: productImageId,
          url: "/images/product-13/p13-2.jpg",
        },
        {
          id: productImageId,
          url: "/images/product-13/p13-3.jpg",
        },
        {
          id: productImageId,
          url: "/images/product-13/p13-4.jpg",
        },
      ],
      price: 294000,
      countInStock: 0,
      rating: 4.2,
      numReviews: 120,
      description:
        "Dòng quần tây mới nhất được thiết kế nổi bật với chi tiết thêu hàng nghìn mũi kim trên thân quần tỉ mỉ & sang trọng.",
      colors: ["#000000"],
      size: ["S", "M", "L"],
      newArrivals: false,
      productSale: true,
      saleOf: 10,
    },
    {
      name: "Quần tây Nomous Essentials slim fit",
      category: "Quần Tây",
      images: [
        {
          id: productImageId,
          url: "/images/product-14/p14.jpg",
        },
        {
          id: productImageId,
          url: "/images/product-14/p14-2.jpg",
        },
        {
          id: productImageId,
          url: "/images/product-14/p14-3.jpg",
        },
        {
          id: productImageId,
          url: "/images/product-14/p14-4.jpg",
        },
      ],
      price: 294000,
      countInStock: 50,
      rating: 4.7,
      numReviews: 110,
      description:
        "Quần âu NOMOUS ESSENTIALS với chất liệu vải mới mang đến sự thoải mái với thành phần sợi spandex cao hơn. Thiết kế quần cũng mang lại sự trẻ trung với các chi tiết kèm theo và form slim fit mới giúp dáng quần ôm vừa vặn hơn, không bó sát.",
      colors: ["#000000", "#808080", "#00008B"],
      size: ["S", "M", "L", "XL"],
      productSale: true,
      saleOf: 10,
    },
    {
      name: "Quần tây MASCUS skinny",
      images: [
        {
          id: productImageId,
          url: "/images/product-15/p15.jpg",
        },
        {
          id: productImageId,
          url: "/images/product-15/p15-2.jpg",
        },
        {
          id: productImageId,
          url: "/images/product-15/p15-3.jpg",
        },
        {
          id: productImageId,
          url: "/images/product-15/p15-4.jpg",
        },
      ],
      category: "Quần Tây",
      price: 266000,
      countInStock: 11,
      rating: 4.2,
      numReviews: 10,
      description:
        "Chất vải đợt này cực kì đẹp luôn nha ae, có thun co giãn rất thoải mái. Form skinny trẻ trung & tôn dáng.",
      colors: ["#000000", "#808080", "#00008B"],
      size: ["S", "M", "L"],
    },
    {
      name: "Túi Đeo Chéo BOUTON Black",
      category: "Balo - Túi xách",
      images: [
        {
          id: productImageId,
          url: "/images/product-16/p16.jpg",
        },
        {
          id: productImageId,
          url: "/images/product-16/p16-2.jpg",
        },
        {
          id: productImageId,
          url: "/images/product-16/p16-3.jpg",
        },
        {
          id: productImageId,
          url: "/images/product-16/p16-4.jpg",
        },
      ],
      price: 176000,
      countInStock: 1,
      rating: 4.4,
      numReviews: 20,
      description:
        "Điểm nhấn của dòng này là các chi tiết & dây kéo được gắn trên túi. Items này ae mang đi chơi hay đi tập khá tiện lợi.",
      colors: ["#000000"],
      size: ["S", "M"],
      productSale: true,
      saleOf: 20,
    },
    {
      name: "Balo NMES x Logomania pattern",
      category: "Balo - Túi xách",
      images: [
        {
          id: productImageId,
          url: "/images/product-17/p17.jpg",
        },
        {
          id: productImageId,
          url: "/images/product-17/p17-2.jpg",
        },
        {
          id: productImageId,
          url: "/images/product-17/p17-3.jpg",
        },
        {
          id: productImageId,
          url: "/images/product-17/p17-4.jpg",
        },
      ],
      price: 640000,
      countInStock: 31,
      rating: 4.2,
      numReviews: 52,
      description: "Kích cỡ: 40x30x14cm",
      colors: ["#000000"],
      size: ["S", "M", "L"],
    },
    {
      name: "Dép BOUTON Chain",
      category: "Giày dép",
      images: [
        {
          id: productImageId,
          url: "/images/product-18/p18.jpg",
        },
        {
          id: productImageId,
          url: "/images/product-18/p18-2.jpg",
        },
        {
          id: productImageId,
          url: "/images/product-18/p18-3.jpg",
        },
        {
          id: productImageId,
          url: "/images/product-18/p18-4.jpg",
        },
      ],
      price: 256000,
      countInStock: 15,
      rating: 4.3,
      numReviews: 22,
      description: "Chất liệu khá bền bỉ, ae đi mùa mưa này hoàn toàn yên tâm ",
      colors: ["#000000"],
      size: ["S", "M", "L", "XL"],
      productSale: true,
      saleOf: 15,
    },
    {
      name: "Giày sandals T.EVA Hurricane",
      category: "Giày dép",
      images: [
        {
          id: productImageId,
          url: "/images/product-19/p19.jpg",
        },
        {
          id: productImageId,
          url: "/images/product-19/p19-2.jpg",
        },
        {
          id: productImageId,
          url: "/images/product-19/p19-3.jpg",
        },
        {
          id: productImageId,
          url: "/images/product-19/p19-4.jpg",
        },
      ],
      price: 161000,
      countInStock: 45,
      rating: 4.0,
      numReviews: 64,
      description: "Chất liệu khá bền bỉ, ae đi mùa mưa này hoàn toàn yên tâm ",
      colors: ["#000000", "blue"],
      size: ["S", "M", "L"],
    },
    {
      name: "Giày Chelsea Boots ICON DENIM Da Lộn",
      category: "Giày dép",
      images: [
        {
          id: productImageId,
          url: "/images/product-20/p20.jpg",
        },
        {
          id: productImageId,
          url: "/images/product-20/p20-2.jpg",
        },
        {
          id: productImageId,
          url: "/images/product-20/p20-3.jpg",
        },
        {
          id: productImageId,
          url: "/images/product-20/p20-4.jpg",
        },
      ],
      price: 720000,
      countInStock: 55,
      rating: 4.0,
      numReviews: 24,
      description: "Chất liệu khá bền bỉ, ae đi mùa mưa này hoàn toàn yên tâm ",
      colors: ["#000000", "#8B4513"],
      size: ["S", "M"],
      productSale: true,
      saleOf: 20,
    },
    {
      name: "Giày lười ZRA ss21",
      category: "Giày dép",
      images: [
        {
          id: productImageId,
          url: "/images/product-21/p21.jpg",
        },
        {
          id: productImageId,
          url: "/images/product-21/p21-2.jpg",
        },
        {
          id: productImageId,
          url: "/images/product-21/p21-3.jpg",
        },
        {
          id: productImageId,
          url: "/images/product-21/p21-4.jpg",
        },
      ],
      price: 532000,
      countInStock: 45,
      rating: 4.7,
      numReviews: 28,
      description: "Dòng này lên đồ cực sang & trendy luôn",
      colors: ["#000000"],
      size: ["S", "M"],
    },
    {
      name: "Áo khoác bomber BOUTON logo",
      category: "Áo Khoác",
      images: [
        {
          id: productImageId,
          url: "/images/product-22/p22.jpg",
        },
        {
          id: productImageId,
          url: "/images/product-22/p22-2.jpg",
        },
        {
          id: productImageId,
          url: "/images/product-22/p22-3.jpg",
        },
        {
          id: productImageId,
          url: "/images/product-22/p22-4.jpg",
        },
        {
          id: productImageId,
          url: "/images/product-22/p22-5.jpg",
        },
      ],
      price: 680000,
      countInStock: 22,
      rating: 4.3,
      numReviews: 10,
      description: "Chelsea Boots ICON DENIM ",
      colors: ["#000000"],
      size: ["S", "M", "XL"],
      productSale: true,
      saleOf: 10,
    },
    {
      name: "Giày chelsea boots MASCUS da lộn",
      category: "Giày dép",
      images: [
        {
          id: productImageId,
          url: "/images/product-23/p23.jpg",
        },
        {
          id: productImageId,
          url: "/images/product-23/p23-2.jpg",
        },
        {
          id: productImageId,
          url: "/images/product-23/p23-3.jpg",
        },
        {
          id: productImageId,
          url: "/images/product-23/p23-4.jpg",
        },
      ],
      price: 425000,
      countInStock: 55,
      rating: 4.1,
      numReviews: 12,
      description:
        "Hàng mới lên kệ liên tục tận những ngày cuối Tết. Và Siêu phẩm chelsea boots da lộn cũng vừa mới lên kệ hôm nay nha ae ",
      colors: ["#000000", "#8B4513"],
      size: ["S", "M", "L"],
    },
    {
      name: "Thắt lưng ICON DENIM w logo ICDN SS20",
      category: "Phụ kiện khác",
      images: [
        {
          id: productImageId,
          url: "/images/product-24/p24.jpg",
        },
        {
          id: productImageId,
          url: "/images/product-24/p24-2.jpg",
        },
        {
          id: productImageId,
          url: "/images/product-24/p24-3.jpg",
        },
        {
          id: productImageId,
          url: "/images/product-24/p24-4.jpg",
        },
      ],
      price: 315000,
      countInStock: 10,
      rating: 4.4,
      numReviews: 3,
      description: "Dòng này ae mặc quần jeans, kaki hay quần âu đều ok nha.",
      colors: ["#000000", "#f2f2f2"],
      size: ["S", "M", "L", "XL"],
    },
    {
      name: "Set Boxer RUNPOW Getting Stronger",
      category: "Phụ kiện khác",
      images: [
        {
          id: productImageId,
          url: "/images/product-25/p25.jpg",
        },
        {
          id: productImageId,
          url: "/images/product-25/p25-2.jpg",
        },
        {
          id: productImageId,
          url: "/images/product-25/p25-3.jpg",
        },
        {
          id: productImageId,
          url: "/images/product-25/p25-4.jpg",
        },
      ],
      price: 96000,
      countInStock: 20,
      rating: 4.2,
      numReviews: 43,
      description:
        "Boxer RUNPOW Getting Stronger.Dòng boxer lần đầu tiên lên kệ của RUNPOW với thiết kế năng động, mang đậm tính thể thao.",
      colors: ["#000000", "#f2f2f2"],
      size: ["S", "M", "L", "XL"],
      productSale: true,
      saleOf: 15,
    },
    {
      name: "Nón BOUTON w details logo ss20",
      category: "Phụ kiện khác",
      images: [
        {
          id: productImageId,
          url: "/images/product-26/p26.jpg",
        },
        {
          id: productImageId,
          url: "/images/product-26/p26-2.jpg",
        },
        {
          id: productImageId,
          url: "/images/product-26/p26-3.jpg",
        },
        {
          id: productImageId,
          url: "/images/product-26/p26-4.jpg",
        },
      ],
      price: 200000,
      countInStock: 1,
      rating: 4.2,
      numReviews: 4,
      description: "BOUTON with logo side cap ",
      colors: ["#000000", "#f2f2f2"],
      size: ["S", "M", "L", "XL"],
    },
    {
      name: "Vớ Lười BOUTON INVISIBLE",
      category: "Phụ kiện khác",
      images: [
        {
          id: productImageId,
          url: "/images/product-27/p27.jpg",
        },
        {
          id: productImageId,
          url: "/images/product-27/p27-2.jpg",
        },
        {
          id: productImageId,
          url: "/images/product-27/p27-3.jpg",
        },
        {
          id: productImageId,
          url: "/images/product-27/p27-4.jpg",
        },
      ],
      price: 20000,
      countInStock: 15,
      rating: 4.4,
      numReviews: 31,
      description: "Sợi vải cotton dệt mịn, thoáng, độ dàn hồi cực cao.",
      colors: ["#000000", "#f2f2f2", "#808080"],
      size: ["S", "M", "L", "XL"],
    },
    {
      name: "Thắt lưng PED. camo ss21",
      category: "Phụ kiện khác",
      images: [
        {
          id: productImageId,
          url: "/images/product-28/p28.jpg",
        },
        {
          id: productImageId,
          url: "/images/product-28/p28-2.jpg",
        },
        {
          id: productImageId,
          url: "/images/product-28/p28-3.jpg",
        },
        {
          id: productImageId,
          url: "/images/product-28/p28-4.jpg",
        },
      ],
      price: 320000,
      countInStock: 1,
      rating: 4.5,
      numReviews: 35,
      description:
        "Belt PED. Camouglage Pattern Date 2021 xịn xò luôn nha ae ơi",
      colors: ["#000000"],
      size: ["S", "M", "L", "XL"],
      productSale: true,
      saleOf: 20,
    },
    {
      name: "Ví đứng MASCUS mini ss21",
      category: "Phụ kiện khác",
      images: [
        {
          id: productImageId,
          url: "/images/product-29/p29.jpg",
        },
        {
          id: productImageId,
          url: "/images/product-29/p29-2.jpg",
        },
        {
          id: productImageId,
          url: "/images/product-29/p29-3.jpg",
        },
        {
          id: productImageId,
          url: "/images/product-29/p29-4.jpg",
        },
      ],
      price: 190000,
      countInStock: 80,
      rating: 4.6,
      numReviews: 3,
      description:
        "Năm mới ae có đổi ví thì sắm ngay em này nhé, nhỏ gọn nhưng thiết kế nhiều ngăn, rất hiện đại & tiện lợi.",
      colors: ["#000000"],
      size: ["S", "M", "L", "XL"],
    },
    {
      name: "Mắt Kính G.M MOMATI",
      category: "Phụ kiện khác",
      images: [
        {
          id: productImageId,
          url: "/images/product-30/p30.jpg",
        },
        {
          id: productImageId,
          url: "/images/product-30/p30-2.jpg",
        },
        {
          id: productImageId,
          url: "/images/product-30/p30-3.jpg",
        },
        {
          id: productImageId,
          url: "/images/product-30/p30-4.jpg",
        },
      ],
      price: 290000,
      countInStock: 10,
      rating: 4.4,
      numReviews: 31,
      description: "",
      colors: ["#000000"],
      size: ["S", "M", "L"],
    },
  ],
};

export default data;
