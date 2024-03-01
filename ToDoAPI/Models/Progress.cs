namespace ToDoAPI.Models
{
    public class Progress
    {
        public int ProgressID { get; set; }
        public string Title { get; set; }
        public int Position { get; set; }
        public List<MyTask> Tasks { get; set; }
    }
}
