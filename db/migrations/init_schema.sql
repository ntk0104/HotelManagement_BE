CREATE TABLE "Users" (
  "id" varchar UNIQUE PRIMARY KEY,
  "salt" varchar NOT NULL,
  "password" varchar NOT NULL,
  "email" varchar NOT NULL UNIQUE,
  "userType" varchar,
  "firstName" varchar,
  "lastName" varchar,
  "phoneNumber" varchar,
  "dob" date,
  "profileImage" varchar,
  "address" varchar,
  "isEmailVerified" boolean DEFAULT false,
  "isPhoneVerified" boolean DEFAULT false,
  "deleted" boolean DEFAULT false,
  "createdBy" varchar,
  "createdAt" TIMESTAMP DEFAULT (now()),
  "updatedBy" varchar,
  "updatedAt" TIMESTAMP DEFAULT (now())
);
-- roomType: 0:1bed / 1: 2 beds / 2: special co ghe tinh yeu / 3: fan only-no air condition
-- status: available: can pick this room or notAvailable: cannot pick this room 
CREATE TABLE "Rooms" (
  "id" varchar UNIQUE PRIMARY KEY,
  "roomName" varchar NOT NULL,
  "roomType" int NOT NULL,
  "overnightPrice" int NOT NULL,
  "shorttimePrice_Fan" int NOT NULL,
  "shorttimePrice_Air" int NOT NULL,
  "status" varchar DEFAULT 'available',
  "createdBy" varchar,
  "createdAt" TIMESTAMP DEFAULT (now()),
  "updatedBy" varchar,
  "updatedAt" TIMESTAMP DEFAULT (now())
);

INSERT INTO "Rooms" ("id","roomName","roomType","overnightPrice","shorttimePrice_Fan", "shorttimePrice_Air") VALUES ('room18', 'Phòng 18', 3, 100000, 60000, 100000);
INSERT INTO "Rooms" ("id","roomName","roomType","overnightPrice","shorttimePrice_Fan", "shorttimePrice_Air") VALUES ('room09', 'Phòng 9', 2, 150000, 60000, 100000);
INSERT INTO "Rooms" ("id","roomName","roomType","overnightPrice","shorttimePrice_Fan", "shorttimePrice_Air") VALUES ('room10', 'Phòng 10', 1, 180000, 60000, 100000);
INSERT INTO "Rooms" ("id","roomName","roomType","overnightPrice","shorttimePrice_Fan", "shorttimePrice_Air") VALUES ('room11', 'Phòng 11', 1, 200000, 60000, 100000);
INSERT INTO "Rooms" ("id","roomName","roomType","overnightPrice","shorttimePrice_Fan", "shorttimePrice_Air") VALUES ('room12', 'Phòng 12', 1, 200000, 60000, 100000);
INSERT INTO "Rooms" ("id","roomName","roomType","overnightPrice","shorttimePrice_Fan", "shorttimePrice_Air") VALUES ('room13', 'Phòng 13', 2, 150000, 60000, 100000);
INSERT INTO "Rooms" ("id","roomName","roomType","overnightPrice","shorttimePrice_Fan", "shorttimePrice_Air") VALUES ('room14', 'Phòng 14', 2, 150000, 60000, 100000);
INSERT INTO "Rooms" ("id","roomName","roomType","overnightPrice","shorttimePrice_Fan", "shorttimePrice_Air") VALUES ('room15', 'Phòng 15', 2, 150000, 60000, 100000);
INSERT INTO "Rooms" ("id","roomName","roomType","overnightPrice","shorttimePrice_Fan", "shorttimePrice_Air") VALUES ('room16', 'Phòng 16', 2, 180000, 60000, 100000);
INSERT INTO "Rooms" ("id","roomName","roomType","overnightPrice","shorttimePrice_Fan", "shorttimePrice_Air") VALUES ('room17', 'Phòng 17', 0, 150000, 60000, 100000);
INSERT INTO "Rooms" ("id","roomName","roomType","overnightPrice","shorttimePrice_Fan", "shorttimePrice_Air") VALUES ('room08', 'Phòng 8', 3, 100000, 60000, 100000);
INSERT INTO "Rooms" ("id","roomName","roomType","overnightPrice","shorttimePrice_Fan", "shorttimePrice_Air") VALUES ('room07', 'Phòng 7', 0, 150000, 60000, 100000);
INSERT INTO "Rooms" ("id","roomName","roomType","overnightPrice","shorttimePrice_Fan", "shorttimePrice_Air") VALUES ('room06', 'Phòng 6', 1, 200000, 60000, 100000);
INSERT INTO "Rooms" ("id","roomName","roomType","overnightPrice","shorttimePrice_Fan", "shorttimePrice_Air") VALUES ('room05', 'Phòng 5', 1, 200000, 60000, 100000);
INSERT INTO "Rooms" ("id","roomName","roomType","overnightPrice","shorttimePrice_Fan", "shorttimePrice_Air") VALUES ('room04', 'Phòng 4', 2, 150000, 60000, 100000);
INSERT INTO "Rooms" ("id","roomName","roomType","overnightPrice","shorttimePrice_Fan", "shorttimePrice_Air") VALUES ('room03', 'Phòng 3', 2, 150000, 60000, 100000);
INSERT INTO "Rooms" ("id","roomName","roomType","overnightPrice","shorttimePrice_Fan", "shorttimePrice_Air") VALUES ('room02', 'Phòng 2', 2, 180000, 60000, 100000);

-- DG/CD/QD and discount on each group
CREATE TABLE "Membership" (
  "id" varchar UNIQUE PRIMARY KEY,
  "membershipName" varchar NOT NULL,
  "overnight_DiscountPercentage" float NOT NULL,
  "shorttimePrice_Fan_DiscountPercentage" float NOT NULL,
  "shorttimePrice_Air_DiscountPercentage" float NOT NULL
);

INSERT INTO "Membership" ("id","membershipName","overnight_DiscountPercentage","shorttimePrice_Fan_DiscountPercentage","shorttimePrice_Air_DiscountPercentage") VALUES ('dg', 'Đi giờ', 0, 16.7, 20);
INSERT INTO "Membership" ("id","membershipName","overnight_DiscountPercentage","shorttimePrice_Fan_DiscountPercentage","shorttimePrice_Air_DiscountPercentage") VALUES ('qd', 'Qua đêm', 0, 0, 0);

-- service items
CREATE TABLE "ServiceItems" (
  "id" varchar UNIQUE PRIMARY KEY,
  "name" varchar NOT NULL,
  "unitPrice" int NOT NULL,
  "availableQuanity" int DEFAULT 0,
  "createdBy" varchar,
  "createdAt" bigint,
  "updatedBy" varchar,
  "updatedAt" bigint,
  "isDeleted" boolean DEFAULT false
);

INSERT INTO "ServiceItems" ("id","name","unitPrice", "createdBy", "createdAt") VALUES ('migoi', 'Mì gói không', 10000, 'roynguyen147@gmail.com', 1612320908778);
INSERT INTO "ServiceItems" ("id","name","unitPrice", "createdBy", "createdAt") VALUES ('migoitrung', 'Mì gói trứng', 15000, 'roynguyen147@gmail.com', 1612320908779);
INSERT INTO "ServiceItems" ("id","name","unitPrice", "createdBy", "createdAt") VALUES ('tiger', 'Bia Tiger', 15000, 'roynguyen147@gmail.com', 1612320908780);
INSERT INTO "ServiceItems" ("id","name","unitPrice", "createdBy", "createdAt") VALUES ('heneiken', 'Bia Heneiken', 20000, 'roynguyen147@gmail.com', 1612320908781);
INSERT INTO "ServiceItems" ("id","name","unitPrice", "createdBy", "createdAt") VALUES ('coca', 'Cocacola', 15000, 'roynguyen147@gmail.com', 1612320908782);
INSERT INTO "ServiceItems" ("id","name","unitPrice", "createdBy", "createdAt") VALUES ('7up', '7Ups', 15000, 'roynguyen147@gmail.com', 1612320908783);

-- History Section - Lượt khách vào
-- status: 0: chưa trả đủ tiền và chưa trả phòng, 1: khách chưa trả phòng nhưng tiền đã trả đủ, 2: khách đã trả phòng + trả tiền, 3: khách đã trả phòng + khách giựt tiền (2 và 3: section đã hoàn thành)
-- userNote: note mà người dùng gõ vào
-- systemNote: note hệ thống log do các thay đổi
-- totalSubtractedCost: các tiền trừ đi bớt được
-- totalCost: số tiền khách hàng phải trả, số tiền này khi status = 0 (section chưa kết thúc thì luôn = 0, tiền được tính bằng công thức generate ra chứ ko phải từ DB)
-- sectionType: ĐG (dg)/ Qua đêm (qd)
-- sectionRoomType: phòng lạnh (air) / phòng quạt (fan)
CREATE TABLE "HistoryTransactions" (
  "id" varchar UNIQUE PRIMARY KEY,
  "timeIn" bigint NOT NULL,
  "timeOut" bigint,
  "userNote" varchar DEFAULT '',
  "systemNote" varchar DEFAULT '[]',
  "selectedRoomID" varchar NOT NULL REFERENCES "Rooms"("id"),
  "usedItems" varchar DEFAULT '[]',
  "sectionType" varchar DEFAULT '' REFERENCES "Membership"("id"),
  "sectionRoomType" varchar DEFAULT 'air',
  "cmndImg" varchar,
  "status" int NOT NULL DEFAULT 0,
  "totalCost" int NOT NULL DEFAULT 0,
  "totalSubtractedCost" int DEFAULT 0,
  "createdBy" varchar,
  "createdAt" bigint,
  "updatedBy" varchar,
  "updatedAt" bigint
);

-- tiền trong tủ
-- type: true:bỏ tiền vô / false: rút tiền ra
-- isChecked: true: là admin chốt tiền/ false: tiền từ các nguồn khác
-- baselineAmount: số tiền còn lại thực tế trong tủ tại thời điểm chốt tiền 

CREATE TABLE "CashboxTransactions" (
  "id" varchar UNIQUE PRIMARY KEY,
  "type" boolean NOT NULL,
  "changedCash" int NOT NULL,
  "note" varchar DEFAULT '',
  "isChecked" boolean DEFAULT false,
  "baselineAmount" int DEFAULT 0,
  "createdBy" varchar,
  "createdAt" bigint,
  "updatedBy" varchar,
  "updatedAt" bigint
);

INSERT INTO "CashboxTransactions" ("id","type","changedCash", "note", "isChecked", "baselineAmount","createdBy", "createdAt", "updatedBy", "updatedAt") 
                          VALUES ('1', false, 0, 'Chốt tiền', true, 0, 'roynguyen147@gmail.com', 1, 'roynguyen147@gmail.com', 1);