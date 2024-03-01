$(function () {
    //Làm sạch console
    console.clear();

    //Bài 1: Khai báo mảng numList = [1, 2, 7, 4, 3, 5];
    const numList = [1, 2, 7, 4, 3, 5];
    console.log('Bài 1: Mảng numList đã nhập là:');
    console.log(numList);

    //Bài 1.1
    console.log('Bài 1.1: In ra các phần từ có giá trị lớn hơn 5 là:');
    for (var i = 0; i < numList.length; i++) {
        if (numList[i] > 5)
            console.log(numList[i]);
    }

    //Bài 1.2
    console.log('Bài 1.2: In ra vị trí của số 7');
    var viTriSo7 = -1;
    for (var i = 0; i < numList.length; i++) {
        if (numList[i] == 7) {
            viTriSo7 = i;
        }
    }

    if (viTriSo7 != -1) {
        console.log('Số 7 có trong danh sách, tại vị trí thứ: ' + viTriSo7);
    }
    else {
        console.log('Số 7 không có trong danh sách');
    }

    //Bài 1.3
    console.log('Bài 1.3 Sắp xếp mảng trên theo thứ tự nhỏ đến lớn');
    numList.sort(function (a, b) {
        return a - b;
    });
    //In ra mảng đã sắp xếp
    console.log(numList);

    //Bài 1.4
    console.log('1.4 Xoá phần tử có giá trị 3 ra khỏi mảng');
    var newNumList = numList.filter(num => num !== 3);
    //In ra mảng mới đã xóa phần tử có giá trị 3 trong mảng
    console.log(newNumList);

    //Bài 2: Thêm newMember vào mảng devMember
    console.log('Bài 2: Thêm newMember vào mảng devMember');
    const devMember = [
        { Name: "Lê Thành Hiếu", Email: "hieu.lt@oryza.vn" },
        { Name: "Nguyễn Văn Phần", Email: "phan.nv@oryza.vn" },
    ];

    console.log('Mảng devMember có giá trị là:');
    console.log(devMember);

    const newMember = { Name: "Nguyễn Văn Phần", Email: "phan.nv@oryza.vn" };
    console.log('Đối tượng newMember có giá trị là:');
    console.log(newMember);

    console.log('Thêm newMember vào trong mảng devMember, khi đó mảng devMember có giá trị là:');
    devMember.push(newMember);
    console.log(devMember);

    //Bài 3: sử dụng biến devMember đã làm ở câu 2:
    //Bài 3.1 thêm giá trị Age = 27 cho phần tử đầu tiên trong mảng
    console.log('Bài 3:');
    console.log('Bài 3.1 thêm giá trị Age = 27 cho phần tử đầu tiên trong mảng, khi đó devMember có giá trị là');
    devMember[0].Age = 27;
    console.log(devMember);

    //Bài 3.2 Thêm object: {Company: ‘Oryza JSC’} vào vị trí đầu tiên của mảng devMember
    console.log('Thêm object: {Company: ‘Oryza JSC’} vào vị trí đầu tiên của mảng devMember, khi đó devMember có giá trị là');
    //devMember.unshift({ Company: 'Oryza JSC' });
    console.log(devMember);

    //Bài 4: Hãy đặt tên và khai báo các biến sau:
    console.log('Bài 4: Hãy đặt tên và khai báo các biến sau:');
    // Biến chứa tổng các giá trị thập phân
    let sumDecimalValues = 0;

    // Biến là hằng số chứa đường dẫn api 'http://localhost:3000'
    const API_URL = 'http://localhost:3000';

    // Biến chứa mảng tên thành viên trong nhóm: Thông, Hải, Phần, Linh, Lâm
    const memberNames = ['Thông', 'Hải', 'Phần', 'Linh', 'Lâm'];

    // Biến chứa giá trị phân biệt có phải là lập trình viên hay không
    let isProgrammer = true;

    //Bài 6: Viết validate:
    console.log('Bài 6: Viết validate:');

    //Bài 6.1 Kiểm tra email (định dạng có đúng email không) hoặc số điện thoại (chỉ có số).
    console.log('Bài 6.1 Kiểm tra email (định dạng có đúng email không) hoặc số điện thoại (chỉ có số).');
    function validateEmailOrPhoneNumber(input) {
        const emailOrPhoneNumberRegex = /^(?:\d{10}|\w+@\w+\.\w{2,3})$/;
        return emailOrPhoneNumberRegex.test(input);
    }
    console.log('Kiểm tra: demo@gmail.com có phải là email hoặc số điện thoại không?');
    console.log(validateEmailOrPhoneNumber('demo@gmail.com')); // true

    console.log('Kiểm tra: 0979987654 có phải là email hoặc số điện thoại không?');
    console.log(validateEmailOrPhoneNumber('0979987654')); // true

    console.log('Kiểm tra: demo123456789 có phải là email hoặc số điện thoại không?');
    console.log(validateEmailOrPhoneNumber('demo123456789')); // false

    console.log('Kiểm tra: demo@gmail@demo.com có phải là email hoặc số điện thoại không?');
    console.log(validateEmailOrPhoneNumber('demo@gmail@demo.com')); // false

    //Bài 6.2 Kiểm tra mật khẩu phải có ký tự hoa, ký tự thường và ký tự đặc biệt, dài hơn 6 ký tự. Lưu ý: viết gộp thành 1 biểu thức regex
    console.log('Bài 6.2 Kiểm tra mật khẩu phải có ký tự hoa, ký tự thường và ký tự đặc biệt, dài hơn 6 ký tự. Lưu ý: viết gộp thành 1 biểu thức regex');
    function validatePassword(input) {
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).{6,}$/;
        return passwordRegex.test(input);
    }
    console.log('Kiểm tra Hello@1234 là mật khẩu hợp lệ hay không?');
    console.log(validatePassword('Hello@1234')); // true

    console.log('Kiểm tra 123456 là mật khẩu hợp lệ hay không?');
    console.log(validatePassword('123456')); // false

    //Bài 7: Cho api và thông tin đăng nhập, viết sự kiện đăng nhập
    console.log('Bài 7: Cho api và thông tin đăng nhập, viết sự kiện đăng nhập');
    $("#btn-login").click(function () {
        var parrams = new Object();
        parrams.sdt = '0338013262';
        parrams.email = 'phan.vn@oryza.vn';
        parrams.password = '1';
        $.ajax({
            url: 'https://oryzacloud.oesystem.vn/api/login',
            type: 'POST',
            dataType: 'json',
            data: parrams,
            success: function (data, textStatus, xhr) {
                console.log(data);
            },
            error: function (xhr, textStatus, errorThrown) {
                console.log('Error in Operation');
            }
        });
    });
});