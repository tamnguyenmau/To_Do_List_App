$(function () {
    let toDoContainer = $(".todo-container");
    let addBox = toDoContainer.find(".add-box");
    let listBoxDoTask = toDoContainer.find(".do-task .list-box");
    let listBoxDoneTask = toDoContainer.find(".done-task .list-box");
    let inputAdd = addBox.find(".input-add");
    let buttonAdd = addBox.find(".button-add");
    let buttonRemove = toDoContainer.find("fieldset .remove");

    //Khai báo các biến xử lý thêm category
    let categoryBox = toDoContainer.find(".category-box");
    let categoryList = categoryBox.find(".category-list");
    let categoryAdd = categoryBox.find(".category-add");
    let categoryButtonSave = categoryAdd.find(".btn-save-category");
    let categoryInput = categoryAdd.find("input");
    let categoryButtonRemove = categoryList.find(".remove");

    //Load danh sách category
    let loadCategory = function () {
        var options = {};
        options.url = "https://localhost:7068/api/category/get";
        options.type = "GET";
        options.dataType = "json";
        options.success = function (data) {
            //debugger;
            var categoryList = $(".category-list");
            categoryList.empty();

            data.forEach(function (element) {
                var template = `<li data-catid="${element.categoryID}">
                                    <a class="title" href="#">
                                        <i class="fas fa-bars"></i>
                                        <label>${element.title}</label>
                                        <input type="text" value="${element.title}" />
                                    </a>
                                    <span class="remove">
                                        <i class="fa-solid fa-trash"></i>
                                    </span>
                                </li>`;

                categoryList.append(template);
            });
        };
        options.error = function () {
            var categoryList = $(".category-list");
            categoryList.empty();
            alert("Không thể kết nối đến API, vui lòng kiểm tra lại kết nối");
        };
        $.ajax(options);
    };

    //Thêm 1 catgory vào trong danh sách
    let addCategory = function () {
        var obj = {};
        obj.categoryID = 0;
        obj.title = categoryInput.val();
        obj.createTime = new Date();
        obj.tasks = [];

        var options = {};
        options.url = "https://localhost:7068/api/category/post";
        options.type = "POST";
        options.data = JSON.stringify(obj);
        options.contentType = "application/json";
        options.dataType = "html";
        options.success = function (data) {
            //Load lại danh sách Category
            loadCategory();
            //Xóa trắng ô nhập category
            categoryInput.val("");
        };
        options.error = function () {
            alert("Lỗi");
        };
        $.ajax(options);
    };

    //Chọn 1 category mặc định đầu tiên trong danh sách
    let selectDefaultCategory = function () {
        //Xóa danh sách dotask đang có
        listBoxDoTask.empty();

        //Xóa danh sách donetask đang có
        listBoxDoneTask.empty();

        //Hẹn giờ sau 3s thì load cat đầu tiên
        setTimeout(function () {
            //Chọn mặc định 1 category có trong danh sách
            categoryList.find(".title").eq(0).click();
        }, 2000);
    };

    //Thiết lập màn hình task mặc định
    let setNewTaskStatus = function () {
        //Xóa danh sách dotask đang có
        listBoxDoTask.empty();

        //Xóa danh sách donetask đang có
        listBoxDoneTask.empty();
    };

    //Đăng ký sự kiện click để xóa cho nút xóa category
    categoryList.on("click", ".remove", function () {
        //Xác nhận nhu cầu cần xóa thông qua 1 câu hỏi
        if (confirm("Bạn có chắc muốn xóa danh sách này không?")) {
            let $this = $(this);
            let catid = $this.closest("li").attr("data-catid");

            var options = {};
            options.url = "https://localhost:7068/api/category/delete/" + catid;
            options.type = "DELETE";
            options.dataType = "json";
            options.success = function (result) {
                if (result) {
                    loadCategory();
                }
                else {
                    alert("Đã có lỗi, xóa không thành công");
                }
            };
            options.error = function () {
                alert("Đã có lỗi, xóa không thành công");
            };
            $.ajax(options);
        }
    });

    //Đăng ký sự kiện double click cho label
    categoryList.on("dblclick", ".title label", function () {
        var $this = $(this);

        var root = $this.closest("ul");
        root.find("a").removeClass("editable");

        var parent = $this.closest("a");
        parent.addClass("editable");

        var input = parent.find("input");
        input.focus().select();
    });

    //Đăng ký sự kiện click cho a.title
    categoryList.on("click", ".title", function () {
        var $this = $(this);

        var root = $this.closest("ul");
        root.find("a").removeClass("active");

        $this.addClass("active");

        //Load danh sách task theo category này
        loadTask();
    });

    //Đăng ký sự kiện gõ phím cho input
    categoryList.on("keyup", ".title input", function (e) {
        if (e.keyCode == 13) {
            let $this = $(this);
            let li = $this.closest("li");
            let catID = li.attr("data-catid");
            let title = $this.val();

            var obj = {};
            obj.categoryID = catID;
            obj.title = title;
            obj.createTime = new Date();
            obj.tasks = [];

            var options = {};
            options.url = "https://localhost:7068/api/category/put";
            options.type = "PUT";
            options.data = JSON.stringify(obj);
            options.contentType = "application/json";
            options.dataType = "json";
            options.success = function (result) {
                if (result) {
                    loadCategory();
                }
                else {
                    alert("Đã lưu không thành công, vui lòng thử lại");
                    loadCategory();
                }
            };
            options.error = function () {
                alert("Đã lưu không thành công, vui lòng thử lại");
                loadCategory();
            };
            $.ajax(options);
        }
        else if (e.keyCode == 27) {
            let $this = $(this);
            let parent = $this.closest("a");
            let label = parent.find("label");
            $this.val(label.html());
            parent.removeClass("editable");
        }
    });

    let loadTask = function () {
        let catid = categoryList.find(".title.active").closest("li").attr("data-catid");
        if (!catid || catid < 1) {
            alert("Vui lòng chọn 1 mục bên cột trái");
            return;
        }

        //Load danh sách dotask
        var doOptions = {};
        doOptions.url = `https://localhost:7068/api/mytask/getbycat/${catid}/1`;
        doOptions.type = "GET";
        doOptions.dataType = "json";
        doOptions.success = function (data) {
            console.table(data);

            //Xóa danh sách dotask đang có
            listBoxDoTask.empty();

            //Dùng vòng lặp để render ra danh sách do task
            data.forEach(function (item) {
                let template = `<div class="item" data-mytask-id="${item.myTaskID}">
                                <a class="custome-check">
                                    <i class="fa-sharp fa-solid fa-check check-icon"></i>
                                    <i class="uncheck-icon"></i>
                                    <input type="checkbox" />
                                </a>
                                <label class="title">${item.title}</label>
                                <input type="text" value="${item.title}" />
                                <a class="remove" href="#">
                                    <i class="fa-solid fa-trash"></i>
                                </a>
                            </div>`;

                listBoxDoTask.append(template);
            });
        };
        doOptions.error = function () {
            //var categoryList = $(".category-list");
            //categoryList.empty();
            alert("Không thể kết nối đến API, vui lòng kiểm tra lại kết nối");
        };
        $.ajax(doOptions);

        //Load danh sách donetask
        var doneOptions = {};
        doneOptions.url = `https://localhost:7068/api/mytask/getbycat/${catid}/2`;
        doneOptions.type = "GET";
        doneOptions.dataType = "json";
        doneOptions.success = function (data) {
            console.table(data);
            //Xóa danh sách donetask đang có
            listBoxDoneTask.empty();

            //Dùng vòng lặp để render ra danh sách donetask
            data.forEach(function (item) {
                let template = `<div class="item active" data-mytask-id="${item.myTaskID}">
                                <a class="custome-check">
                                    <i class="fa-sharp fa-solid fa-check check-icon"></i>
                                    <i class="uncheck-icon"></i>
                                    <input type="checkbox" />
                                </a>
                                <label class="title">${item.title}</label>
                                <input type="text" value="${item.title}" />
                                <a class="remove" href="#">
                                    <i class="fa-solid fa-trash"></i>
                                </a>
                            </div>`;

                listBoxDoneTask.append(template);
            });
        };
        doneOptions.error = function () {
            //var categoryList = $(".category-list");
            //categoryList.empty();
            alert("Không thể kết nối đến API, vui lòng kiểm tra lại kết nối");
        };
        $.ajax(doneOptions);
    };

    let addTaskWithTitleAndCat = function (title, catID) {
        let newItem = $(`<div class="item">
                                <a class="custome-check">
                                    <i class="fa-sharp fa-solid fa-check check-icon"></i>
                                    <i class="uncheck-icon"></i>
                                    <input type="checkbox" />
                                </a>
                                <label class="title">${title}</label>
                                <a class="remove" href="#">
                                    <i class="fa-solid fa-trash"></i>
                                </a>
                            </div>`);

        newItem.find(".custome-check").click(function () {
            toggleCheck(this);
        });

        newItem.find(".remove").click(function () {
            removeTask(this);
        });

        listBoxDoTask.prepend(newItem);

        inputAdd.val("");
        inputAdd.focus();


        //Gọi API để thêm mytask này vào danh sách
        var obj = {};
        obj.myTaskID = 0;
        obj.title = title;
        obj.categoryID = parseInt(catID);
        obj.progressID = 1;
        obj.createTime = new Date();
        obj.Category = null;
        obj.Progress = null;

        var options = {};
        options.url = "https://localhost:7068/api/mytask/post";
        options.type = "POST";
        options.data = JSON.stringify(obj);
        options.contentType = "application/json";
        options.dataType = "json";
        options.success = function (result) {
            if (result) {
                loadTask();
            }
            else {
                alert("Đã lưu không thành công, vui lòng thử lại");
                loadTask();
            }
        };
        options.error = function (error) {
            debugger;
            alert("Đã lưu không thành công, vui lòng thử lại");
            loadTask();
        };
        $.ajax(options);
    };

    let addTask = function () {
        let val = inputAdd.val().trim();
        if (val === "") {
            alert("Vui lòng nhập nội dung");
            return;
        }

        let catID = categoryList.find(".title.active").closest("li").attr("data-catid");

        //Nếu cat không có sẵn thì tạo cat rồi sau đó mới thêm task
        if (!catID || catID <= 0) {
            //Nếu chưa chọn Cat nào, thì tạo 1 cat mới
            var obj = {};
            obj.categoryID = 0;
            obj.title = "New title";
            obj.createTime = new Date();
            obj.tasks = [];

            var options = {};
            options.url = "https://localhost:7068/api/category/post";
            options.type = "POST";
            options.data = JSON.stringify(obj);
            options.contentType = "application/json";
            options.dataType = "html";
            options.success = function (data) {
                //Load lại danh sách Category
                loadCategory();
                //Xóa trắng ô nhập category
                categoryInput.val("");
                //Chọn new cat vừa tạo
                setTimeout(function () {
                    categoryList.find(".title").last().click();
                    catID = categoryList.find(".title").last().closest("li").attr("data-catid");
                    //Thêm task vào danh sách của cat này:
                    addTaskWithTitleAndCat(val, catID);
                }, 1000);
            };
            options.error = function () {
                alert("Lỗi");
            };
            $.ajax(options);

            return;
        }

        //Nếu cat có sẵn thì thêm task
        addTaskWithTitleAndCat(val, catID);
    }

    let removeTask = function (e) {
        let result = confirm("Bạn có chắc muốn xóa không?");
        let item = $(e).closest(".item");

        if (result) {
            item.slideUp(500, function () {
                item.remove();

                //Gọi ajax để lên API xóa thật
                let itemID = item.attr("data-mytask-id");

                var options = {};
                options.url = "https://localhost:7068/api/mytask/delete/" + itemID;
                options.type = "DELETE";
                options.dataType = "json";
                options.success = function (result) {
                    if (result) {
                        loadTask();
                    }
                    else {
                        alert("Đã có lỗi, xóa không thành công");
                    }
                };
                options.error = function () {
                    alert("Đã có lỗi, xóa không thành công");
                };
                $.ajax(options);
            });
        }
    }

    let toggleCheck = function (e) {
        let $this = $(e);

        //Từ elem hiện tại, tìm ra cha của nó là item
        let item = $this.closest(".item");

        //Kiểm tra xem item cha đó có active chưa?
        if (item.hasClass("active")) {
            item.removeClass("active");
            item.detach().appendTo(listBoxDoTask);
        }
        else {
            item.addClass("active");
            item.detach().appendTo(listBoxDoneTask);
        }

        //Gọi ajax để lưu trạng thái mới của task
        let itemID = item.attr("data-mytask-id");

        let itemStatus = 1;
        if (item.hasClass("active"))
            itemStatus = 2;

        var options = {};
        options.url = `https://localhost:7068/api/mytask/update-progress/${itemID}/${itemStatus}`;
        options.type = "PATCH";
        options.contentType = "application/json";
        options.dataType = "json";
        options.success = function (result) {
            if (result) {
                loadTask();
            }
            else {
                alert("Đã lưu không thành công, vui lòng thử lại");
                loadTask();
            }
        };
        options.error = function () {
            alert("Đã lưu không thành công, vui lòng thử lại");
            loadTask();
        };
        $.ajax(options);
    };

    //Đăng ký sự kiện thay đổi checkbox mytask
    toDoContainer.on("click", ".item .custome-check", function () {
        toggleCheck(this);
    });

    //Đăng ký sự kiện double click trên item mytask
    toDoContainer.on("dblclick", ".item label", function () {
        var $this = $(this);

        var root = $this.closest(".list-box");
        root.find(".item").removeClass("editable");

        var parent = $this.closest(".item");
        parent.addClass("editable");

        var input = parent.find("input[type=text]");
        input.focus().select();
    });

    //Đăng ký sự kiện bàn phím khi enter trên input mytask
    toDoContainer.on("keyup", ".item > input", function (e) {
        if (e.keyCode == 13) {
            let $this = $(this);
            let item = $this.closest(".item");
            let myTaskID = item.attr("data-mytask-id");
            let title = $this.val();

            let catID = categoryList.find(".title.active").closest("li").attr("data-catid");
            if (!catID || catID <= 0) {
                alert("Vui lòng chọn 1 danh mục bên cột trái trước khi sửa công việc");
                return;
            }

            let progressID = $this.closest("fieldset").find(".do-task").length == 1 ? 1 : 2;

            var obj = {};
            obj.myTaskID = parseInt(myTaskID);
            obj.title = title;
            obj.categoryID = parseInt(catID);
            obj.progressID = progressID;
            obj.createTime = new Date();
            obj.Category = null;
            obj.Progress = null;

            var options = {};
            options.url = "https://localhost:7068/api/mytask/put";
            options.type = "PUT";
            options.data = JSON.stringify(obj);
            options.contentType = "application/json";
            options.dataType = "json";
            options.success = function (result) {
                if (result) {
                    loadTask();
                }
                else {
                    alert("Đã lưu không thành công, vui lòng thử lại");
                    loadTask();
                }
            };
            options.error = function () {
                alert("Đã lưu không thành công, vui lòng thử lại");
                loadTask();
            };
            $.ajax(options);
        }
        else if (e.keyCode == 27) {
            let $this = $(this);
            let parent = $this.closest(".item");
            let label = parent.find("label");
            $this.val(label.html());
            parent.removeClass("editable");
        }
    });

    buttonAdd.click(function () {
        addTask();
    });

    inputAdd.keyup(function (event) {
        if (event.which == 13) {
            addTask();
        }
    });

    //Đăng ký sự kiện click cho nút xóa mytask
    toDoContainer.on("click", ".item .remove", function () {
        removeTask(this);
    });

    //Lập trình thêm Category
    categoryInput.keyup(function (event) {
        if (event.which == 13) {
            addCategory();
        }
    });

    categoryButtonSave.click(function () {
        addCategory();
    });

    //Thực thi các hàm cần thiết khi load trang
    loadCategory();

    //Xóa trắng danh sách task
    setNewTaskStatus();
});

