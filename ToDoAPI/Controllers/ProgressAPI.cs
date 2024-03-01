using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using ToDoAPI.Models;

namespace ToDoAPI.Controllers
{
    [Route("api/progress")]
    [ApiController]
    public class ProgressAPI : ControllerBase
    {
        //Khai báo chuỗi kết nối tới DB
        private const string connectionString = "Data Source=.;Initial Catalog=MicrosoftToDo;Persist Security Info=True;User ID=sa;Password=123456";

        //Khai báo 1 đối tượng SqlService để làm việc với DB
        private SqlService sqlService = new SqlService(connectionString);

        [HttpGet("get")]
        public IEnumerable<Progress> Get()
        {
            //Khai báo 1 DataTable để chứa dữ liệu nhận được từ DB
            DataTable dataTable = new DataTable();

            //Khai báo 1 câu sql để truy vấn dữ liệu 
            string sqlQuery = "Select * From Progress";

            //Khai báo 1 biến Exception để bắt lỗi (nếu có)
            Exception ex = null;

            //Thực thi câu sql, lấy dữ liệu từ DB đổ vào trong dataTable
            dataTable = sqlService.GetDataTable(sqlQuery, CommandType.Text, ref ex);

            //Chuyển đổi dataTable thành dạng danh sách Category
            List<Progress> progresses = new List<Progress>();
            foreach (DataRow row in dataTable.Rows)
            {
                Progress item = new Progress();
                item.ProgressID = Convert.ToInt32(row["ProgressID"]);
                item.Title = Convert.ToString(row["Title"]);
                item.Position = Convert.ToInt32(row["Position"]);

                progresses.Add(item);
            }

            return progresses;
        }

        [HttpGet("get/{id}")]
        public Progress Get(int id)
        {
            //Khai báo 1 DataTable để chứa dữ liệu nhận được từ DB
            DataTable dataTable = new DataTable();

            //Khai báo 1 câu sql để truy vấn dữ liệu 
            string sqlQuery = "Select * From Progress Where ProgressID = " + id;

            //Khai báo 1 biến Exception để bắt lỗi (nếu có)
            Exception ex = null;

            //Thực thi câu sql, lấy dữ liệu từ DB đổ vào trong dataTable
            dataTable = sqlService.GetDataTable(sqlQuery, CommandType.Text, ref ex);

            //Kiểm tra dataTable, nếu dataTable null hoặc rỗng thì trả về null
            if (dataTable == null || dataTable.Rows.Count == 0)
                return null;

            //Lấy ra dòng đầu tiên trong bảng (dòng thứ 0)
            DataRow row = dataTable.Rows[0];

            //Khai báo item có kiểu là Progress để chứa dữ liệu trả về
            Progress item = new Progress();

            //Copy lần lượt từng ô trong row vào trong item
            item.ProgressID = Convert.ToInt32(row["ProgressID"]);
            item.Title = Convert.ToString(row["Title"]);
            item.Position = Convert.ToInt32(row["Position"]);

            //Trả về item chứa kq
            return item;
        }

        [HttpPost("post")]
        public bool Post(Progress item)
        {
            //Khai báo 1 câu sql để insert dữ liệu mới 
            string sqlQuery = "Insert Into Progress (Title, Position) Values (@Title, @Position)";

            //Xóa những tham số đang có sẵn trong sql
            sqlService.ClearParameters();

            //Lần lượt thêm những tham số sql cần đến
            sqlService.AddParameter("@Title", item.Title);
            sqlService.AddParameter("@Position", item.Position);

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
        public bool Put(Progress item)
        {
            //Khai báo 1 câu sql để insert dữ liệu mới 
            string sqlQuery = "Update Progress Set Title=@Title, Position=@Position Where ProgressID=@ProgressID";

            //Xóa những tham số đang có sẵn trong sql
            sqlService.ClearParameters();

            //Lần lượt thêm những tham số sql cần đến
            sqlService.AddParameter("@Title", item.Title);
            sqlService.AddParameter("@Position", item.Position);
            sqlService.AddParameter("@ProgressID", item.ProgressID);

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
            string sqlQuery = "Delete From Progress Where ProgressID=@ProgressID";

            //Xóa những tham số đang có sẵn trong sql
            sqlService.ClearParameters();

            //Lần lượt thêm những tham số sql cần đến
            sqlService.AddParameter("@ProgressID", id);

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
