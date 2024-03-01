using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using ToDoAPI.Models;

namespace ToDoAPI.Controllers
{
    [Route("api/mytask")]
    [ApiController]
    public class MyTaskAPI : ControllerBase
    {
        //Khai báo chuỗi kết nối tới DB
        private const string connectionString = "Data Source=.;Initial Catalog=MicrosoftToDo;Persist Security Info=True;User ID=sa;Password=123456";
        //Khai báo 1 đối tượng SqlService để làm việc với DB
        private SqlService sqlService = new SqlService(connectionString);

        [HttpGet("get")]
        public IEnumerable<MyTask> Get()
        {
            //Khai báo 1 DataTable để chứa dữ liệu nhận được từ DB
            DataTable dataTable = new DataTable();

            //Khai báo 1 câu sql để truy vấn dữ liệu 
            string sqlQuery = "Select * From MyTask";

            //Khai báo 1 biến Exception để bắt lỗi (nếu có)
            Exception ex = null;

            //Thực thi câu sql, lấy dữ liệu từ DB đổ vào trong dataTable
            dataTable = sqlService.GetDataTable(sqlQuery, CommandType.Text, ref ex);

            //Chuyển đổi dataTable thành dạng danh sách Category
            List<MyTask> myTasks = new List<MyTask>();
            foreach (DataRow row in dataTable.Rows)
            {
                MyTask item = new MyTask();
                item.MyTaskID = Convert.ToInt32(row["MyTaskID"]);
                item.Title = Convert.ToString(row["Title"]);
                item.CategoryID = Convert.ToInt32(row["CategoryID"]);
                item.ProgressID = Convert.ToInt32(row["ProgressID"]);
                item.CreateTime = Convert.ToDateTime(row["CreateTime"]);

                myTasks.Add(item);
            }

            return myTasks;
        }

        [HttpGet("get/{id}")]
        public MyTask Get(int id)
        {
            //Khai báo 1 DataTable để chứa dữ liệu nhận được từ DB
            DataTable dataTable = new DataTable();

            //Khai báo 1 câu sql để truy vấn dữ liệu 
            string sqlQuery = "Select * From MyTask Where MyTaskID = " + id;

            //Khai báo 1 biến Exception để bắt lỗi (nếu có)
            Exception ex = null;

            //Thực thi câu sql, lấy dữ liệu từ DB đổ vào trong dataTable
            dataTable = sqlService.GetDataTable(sqlQuery, CommandType.Text, ref ex);

            //Kiểm tra dataTable, nếu dataTable null hoặc rỗng thì trả về null
            if (dataTable == null || dataTable.Rows.Count == 0)
                return null;

            //Lấy ra dòng đầu tiên trong bảng (dòng thứ 0)
            DataRow row = dataTable.Rows[0];

            //Khai báo item có kiểu là MyTask để chứa dữ liệu trả về
            MyTask item = new MyTask();

            //Copy lần lượt từng ô trong row vào trong item
            item.MyTaskID = Convert.ToInt32(row["MyTaskID"]);
            item.Title = Convert.ToString(row["Title"]);
            item.CategoryID = Convert.ToInt32(row["CategoryID"]);
            item.ProgressID = Convert.ToInt32(row["ProgressID"]);
            item.CreateTime = Convert.ToDateTime(row["CreateTime"]);

            //Trả về item chứa kq
            return item;
        }

        [HttpGet("getbycat/{catid}/{pid}")]
        public IEnumerable<MyTask> GetByCat(int catid, int pid)
        {
            //Khai báo 1 DataTable để chứa dữ liệu nhận được từ DB
            DataTable dataTable = new DataTable();

            //Khai báo 1 câu sql để truy vấn dữ liệu 
            string sqlQuery = "Select * From MyTask Where CategoryID=@CategoryID And ProgressID=@ProgressID";

            //Xóa những tham số đang có sẵn trong sql
            sqlService.ClearParameters();

            //Lần lượt thêm những tham số sql cần đến
            sqlService.AddParameter("@CategoryID", catid);
            sqlService.AddParameter("@ProgressID", pid);

            //Khai báo 1 biến Exception để bắt lỗi (nếu có)
            Exception ex = null;

            //Thực thi câu sql, lấy dữ liệu từ DB đổ vào trong dataTable
            dataTable = sqlService.GetDataTable(sqlQuery, CommandType.Text, ref ex);

            //Chuyển đổi dataTable thành dạng danh sách Category
            List<MyTask> myTasks = new List<MyTask>();
            foreach (DataRow row in dataTable.Rows)
            {
                MyTask item = new MyTask();
                item.MyTaskID = Convert.ToInt32(row["MyTaskID"]);
                item.Title = Convert.ToString(row["Title"]);
                item.CategoryID = Convert.ToInt32(row["CategoryID"]);
                item.ProgressID = Convert.ToInt32(row["ProgressID"]);
                item.CreateTime = Convert.ToDateTime(row["CreateTime"]);

                myTasks.Add(item);
            }

            return myTasks;
        }

        [HttpPost("post")]
        public bool Post(MyTask item)
        {
            //Khai báo 1 câu sql để insert dữ liệu mới 
            string sqlQuery = "Insert Into MyTask (Title, CategoryID, ProgressID, CreateTime) Values (@Title, @CategoryID, @ProgressID, @CreateTime)";

            //Xóa những tham số đang có sẵn trong sql
            sqlService.ClearParameters();

            //Lần lượt thêm những tham số sql cần đến
            sqlService.AddParameter("@Title", item.Title);
            sqlService.AddParameter("@CategoryID", item.CategoryID);
            sqlService.AddParameter("@ProgressID", item.ProgressID);
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
        public bool Put(MyTask item)
        {
            //Khai báo 1 câu sql để insert dữ liệu mới 
            string sqlQuery = "Update MyTask Set Title=@Title, CategoryID=@CategoryID, ProgressID=@ProgressID, CreateTime=@CreateTime Where MyTaskID=@MyTaskID";

            //Xóa những tham số đang có sẵn trong sql
            sqlService.ClearParameters();

            //Lần lượt thêm những tham số sql cần đến
            sqlService.AddParameter("@Title", item.Title);
            sqlService.AddParameter("@CategoryID", item.CategoryID);
            sqlService.AddParameter("@ProgressID", item.ProgressID);
            sqlService.AddParameter("@CreateTime", item.CreateTime);
            sqlService.AddParameter("@MyTaskID", item.MyTaskID);

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

        [HttpPatch("update-progress/{id}/{pid}")]
        public bool UpdateProgress(int id, int pid)
        {
            //Khai báo 1 câu sql để insert dữ liệu mới 
            string sqlQuery = "Update MyTask Set ProgressID=@ProgressID Where MyTaskID=@MyTaskID";

            //Xóa những tham số đang có sẵn trong sql
            sqlService.ClearParameters();

            //Lần lượt thêm những tham số sql cần đến
            sqlService.AddParameter("@ProgressID", pid);
            sqlService.AddParameter("@MyTaskID", id);

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
            //Khai báo 1 câu sql để insert dữ liệu mới 
            string sqlQuery = "Delete From MyTask Where MyTaskID=@MyTaskID";

            //Xóa những tham số đang có sẵn trong sql
            sqlService.ClearParameters();

            //Lần lượt thêm những tham số sql cần đến
            sqlService.AddParameter("@MyTaskID", id);

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
