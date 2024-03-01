using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using ToDoAPI.Models;

namespace ToDoAPI.Controllers
{
    [Route("api/category")]
    [ApiController]
    public class CategoryAPI : ControllerBase
    {
        //Khai báo chuỗi kết nối tới DB
        private const string connectionString = "Data Source=.;Initial Catalog=MicrosoftToDo;Persist Security Info=True;User ID=sa;Password=123456";
        //Khai báo 1 đối tượng SqlService để làm việc với DB
        private SqlService sqlService = new SqlService(connectionString);

        [HttpGet("get")]
        public IEnumerable<Category> Get()
        {
            //Khai báo 1 DataTable để chứa dữ liệu nhận được từ DB
            DataTable dataTable = new DataTable();
            
            //Khai báo 1 câu sql để truy vấn dữ liệu 
            string sqlQuery = "Select * From Category";

            //Khai báo 1 biến Exception để bắt lỗi (nếu có)
            Exception ex = null;

            //Thực thi câu sql, lấy dữ liệu từ DB đổ vào trong dataTable
            dataTable = sqlService.GetDataTable(sqlQuery, CommandType.Text, ref ex);

            //Chuyển đổi dataTable thành dạng danh sách Category
            List<Category> categories = new List<Category>();
            foreach (DataRow row in dataTable.Rows)
            {
                Category item = new Category();
                item.CategoryID = Convert.ToInt32(row["CategoryID"]);
                item.Title = Convert.ToString(row["Title"]);
                item.CreateTime = Convert.ToDateTime(row["CreateTime"]);

                categories.Add(item);
            }

            return categories;
        }

        [HttpGet("get/{id}")]
        public Category Get(int id)
        {
            //Khai báo 1 DataTable để chứa dữ liệu nhận được từ DB
            DataTable dataTable = new DataTable();

            //Khai báo 1 câu sql để truy vấn dữ liệu 
            string sqlQuery = "Select * From Category Where CategoryID = " + id;

            //Khai báo 1 biến Exception để bắt lỗi (nếu có)
            Exception ex = null;

            //Thực thi câu sql, lấy dữ liệu từ DB đổ vào trong dataTable
            dataTable = sqlService.GetDataTable(sqlQuery, CommandType.Text, ref ex);

            //Kiểm tra dataTable, nếu dataTable null hoặc rỗng thì trả về null
            if (dataTable == null || dataTable.Rows.Count == 0)
                return null;

            //Lấy ra dòng đầu tiên trong bảng (dòng thứ 0)
            DataRow row = dataTable.Rows[0];

            //Khai báo item có kiểu là Category để chứa dữ liệu trả về
            Category item = new Category();

            //Copy lần lượt từng ô trong row vào trong item
            item.CategoryID = Convert.ToInt32(row["CategoryID"]);
            item.Title = Convert.ToString(row["Title"]);
            item.CreateTime = Convert.ToDateTime(row["CreateTime"]);

            //Trả về item chứa kq
            return item;
        }

        [HttpPost("post")]
        public bool Post(Category item)
        {
            //Khai báo 1 câu sql để insert dữ liệu mới 
            string sqlQuery = "Insert Into Category (Title, CreateTime) Values (@Title, @CreateTime)";
            
            //Xóa những tham số đang có sẵn trong sql
            sqlService.ClearParameters();

            //Lần lượt thêm những tham số sql cần đến
            sqlService.AddParameter("@Title", item.Title);
            sqlService.AddParameter("@CreateTime", item.CreateTime);

            try
            {
                //Thực thi sql đã bao gồm tham số chứa các giá trị
                sqlService.ExecuteQuery(sqlQuery, CommandType.Text, true, true);
                return true;
            }
            catch (Exception)
            {
                //Nếu thực thi sql mà có lỗi ngoại lệ thì trả về false
                return false;
            }
        }

        [HttpPut("put")]
        public bool Put(Category item)
        {
            //Khai báo 1 câu sql để insert dữ liệu mới 
            string sqlQuery = "Update Category Set Title=@Title, CreateTime=@CreateTime Where CategoryID=@CategoryID";

            //Xóa những tham số đang có sẵn trong sql
            sqlService.ClearParameters();

            //Lần lượt thêm những tham số sql cần đến
            sqlService.AddParameter("@Title", item.Title);
            sqlService.AddParameter("@CreateTime", item.CreateTime);
            sqlService.AddParameter("@CategoryID", item.CategoryID);

            try
            {
                //Thực thi sql đã bao gồm tham số chứa các giá trị
                sqlService.ExecuteQuery(sqlQuery, CommandType.Text, true, true);
                return true;
            }
            catch (Exception)
            {
                //Nếu thực thi sql mà có lỗi ngoại lệ thì trả về false
                return false;
            }
        }

        [HttpDelete("delete/{id}")]
        public bool Delete(int id)
        {
            //Khai báo 1 câu sql để delete dữ liệu bên MyTask
            string sqlSubQuery = "Delete From MyTask Where CategoryID=@CategoryID";

            //Xóa những tham số đang có sẵn trong sql
            sqlService.ClearParameters();

            //Lần lượt thêm những tham số sql cần đến
            sqlService.AddParameter("@CategoryID", id);

            try
            {
                //Thực thi sql để xóa dữ liệu bên MyTask
                sqlService.ExecuteQuery(sqlSubQuery, CommandType.Text, true, true);
            }
            catch (Exception){}

            //Khai báo 1 câu sql để delete dữ liệu mới 
            string sqlQuery = "Delete From Category Where CategoryID=@CategoryID";

            try
            {
                //Thực thi sql đã bao gồm tham số chứa các giá trị
                sqlService.ExecuteQuery(sqlQuery, CommandType.Text, true, true);
                return true;
            }
            catch (Exception)
            {
                //Nếu thực thi sql mà có lỗi ngoại lệ thì trả về false
                return false;
            }
        }
    }
}
