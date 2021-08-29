using System;
using System.Collections.Generic;
using System.Web;
using System.Data;
using System.IO;
using System.Text.RegularExpressions;
using System.Web.Script.Serialization;

namespace ServerCollectionView
{
    //
    // Using a HandlerFactory to enable methods other than GET.
    //
    // This requires the following entry in the Web.config file:
    //
    // <system.webServer>
    //   <add verb = "GET,POST,PUT,DELETE" path="*.ashx" name="HandlerFactory" type="ServerCollectionView.HandlerFactory"/>
    // </system.webServer>
    //
    public class HandlerFactory : IHttpHandlerFactory
    {
        public IHttpHandler GetHandler(HttpContext context, string requestType, String url, String pathTranslated)
        {
            return new DataHandler();
        }
        public void ReleaseHandler(IHttpHandler handler)
        {
        }
        public bool IsReusable
        {
            get
            {
                return true;
            }
        }
    }

    /// <summary>
    /// Simple data service used to show how to implement custom
    /// wijmo.collections.CollectionView classes that work against
    /// generic data services.
    /// 
    /// This is a REST service with syntax similar to the one
    /// used by OData:
    /// 
    /// ** To get data, use a GET request in this format:
    /// 
    /// DataHandler.ashx/?$orderby=ORDER_DEF&$filter=FILTER_DEF$skip=SKIP&$top=TOP
    /// 
    /// ORDER_DEF: comma separated list of fields to sort on, syntax like DataView.Sort
    /// https://msdn.microsoft.com/en-us/library/system.data.dataview.sort(v=vs.110).aspx
    /// 
    /// FILTER_DEF: filter expression, syntax like DataView.RowFilter
    /// https://msdn.microsoft.com/en-us/library/system.data.dataview.rowfilter(v=vs.110).aspx
    /// 
    /// SKIP: number of records to skip when getting data
    /// TOP: number of records to include when getting data
    /// 
    /// ** To add an item to the table, use a POST request passing the 
    ///    new item as a parameter.
    ///
    /// ** To edit an existing item, use a PUT request passing the 
    ///    new item as a parameter and its original ID in the URL, e.g
    ///    DataHandler.ashx/(123) [updated item as a parameter]
    ///
    /// ** To remove an item from the table, use a DELETE request 
    ///    passing the  item's ID in the URL, e.g.
    ///    DataHandler.ashx/(123)
    /// </summary>
    public class DataHandler : IHttpHandler
    {
        static DataTable _tblData = DataHandler.GetDataTable(1000);

        public void ProcessRequest(HttpContext context)
        {
            // handle non-GET request types
            switch (context.Request.RequestType)
            {
                case "POST":
                    AddItem(context);
                    return;
                case "PUT":
                    UpdateItem(context);
                    return;
                case "DELETE":
                    DeleteItem(context);
                    return;
            }

            // start with the full view
            var tbl = DataHandler._tblData;
            var tblView = new DataView(tbl);
            var parms = context.Request.Params;

            // apply sort
            var sort = parms["$orderby"];
            if (sort != null)
            {
                tblView.Sort = sort;
            }

            // apply filter
            var filter = parms["$filter"];
            if (filter != null)
            {
                tblView.RowFilter = filter;
            }

            // apply paging
            var items = new List<object>();
            var start = 0;
            var len = tblView.Count;
            var skip = parms["$skip"];
            var top = parms["$top"];
            if (skip != null || top != null)
            {
                int.TryParse(skip, out start);
                int.TryParse(top, out len);
            }
            for (var i = start; i < tblView.Count && i < start + len; i++)
            {
                var item = RowToItem(tblView[i].Row);
                items.Add(item);
            }

            // serialize the output
            var serializer = new JavaScriptSerializer();
            var ov = new OutputValue()
            {
                context = context.Request.Url.PathAndQuery,
                count = tblView.Count, // filtered/unpaged count
                value = items
            };
            var output = serializer.Serialize(ov);

            // write it out
            context.Response.ContentType = "application/json";
            context.Response.Write(output);
        }

        public bool IsReusable
        {
            get
            {
                return true;
            }
        }

        public void AddItem(HttpContext context)
        {
            // create a new row
            var row = DataHandler._tblData.NewRow();
            var item = ItemFromStream(context);
            ItemToRow(item, row);

            // add the new row to the table
            DataHandler._tblData.Rows.Add(row);

            // return the new item as a JSON object
            var serializer = new JavaScriptSerializer();
            item = RowToItem(row);
            var output = serializer.Serialize(item);
            context.Response.ContentType = "application/json";
            context.Response.Write(output);
        }
        public void UpdateItem(HttpContext context)
        {
            var id = GetItemID(context);
            var row = DataHandler._tblData.Rows.Find(id);
            if (row != null)
            {
                var item = ItemFromStream(context);
                ItemToRow(item, row);
            }
        }
        public void DeleteItem(HttpContext context)
        {
            var id = GetItemID(context);
            var row = DataHandler._tblData.Rows.Find(id);
            if (row != null)
            {
                DataHandler._tblData.Rows.Remove(row);
            }
        }

        // conversions
        private Dictionary<string, object> RowToItem(DataRow row)
        {
            var item = new Dictionary<string, object>();
            foreach (DataColumn col in row.Table.Columns)
            {
                var name = col.ColumnName;
                item[name] = row[name];
            }
            return item;
        }
        private void ItemToRow(Dictionary<string, object> item, DataRow row)
        {
            object value;
            foreach (DataColumn col in row.Table.Columns)
            {
                var name = col.ColumnName;
                if (name != "ID" && item.TryGetValue(name, out value))
                {
                    row[name] = value;
                }
            }
        }
        private Dictionary<string, object> ItemFromStream(HttpContext context)
        {
            var stream = context.Request.InputStream;
            stream.Position = 0;
            using (var inputStream = new StreamReader(stream))
            {
                var serializer = new JavaScriptSerializer();
                var content = inputStream.ReadToEnd();
                return serializer.DeserializeObject(content) as Dictionary<string, object>;
            }
        }
        private int GetItemID(HttpContext context)
        {
            int id = -1;
            var m = Regex.Match(context.Request.PathInfo, @"/\((\d+)\)");
            if (m.Success)
            {
                int.TryParse(m.Groups[1].Value, out id);
            }
            return id;
        }

        // create source DataTable
        static DataTable GetDataTable(int count)
        {
            // create table
            var tbl = new DataTable();
            tbl.Columns.Add("ID", typeof(int));
            tbl.Columns.Add("FirstName", typeof(string));
            tbl.Columns.Add("LastName", typeof(string));
            tbl.Columns.Add("Country", typeof(string));
            tbl.Columns.Add("Product", typeof(string));
            tbl.Columns.Add("Amount", typeof(double)).DefaultValue = 0;
            tbl.Columns.Add("Active", typeof(bool)).DefaultValue = true;
            tbl.Columns.Add("Since", typeof(DateTime)).DefaultValue = DateTime.Today;

            // set primary key
            var pk = tbl.Columns["ID"];
            pk.AutoIncrement = true;
            pk.Unique = true;
            tbl.PrimaryKey = new DataColumn[] { pk };

            // populate table
            tbl.BeginLoadData();
            string[] fnames = "Alice,Bella,Cindy,Donna,Elsa,Fred,Gerald,Hugh".Split(',');
            string[] lnames = "Smith,Paulson,O'Toole,McNamara,Stuart,Windsor,Navin,Trudeau".Split(',');
            string[] countries = "Austria,Belgium,Canada,Denmark,Ecuador,Finland,Germany,Japan,USA".Split(',');
            string[] products = "Hammer,Drill,Nailgun,Taser,Chainsaw,Fan".Split(',');
            Random rnd = new Random();
            for (var i = 0; i < count; i++)
            {
                tbl.Rows.Add(
                    i,
                    fnames[rnd.Next(0, fnames.Length - 1)],
                    lnames[rnd.Next(0, lnames.Length - 1)],
                    countries[rnd.Next(0, countries.Length - 1)],
                    products[rnd.Next(0, products.Length - 1)],
                    rnd.NextDouble() * 1000,
                    rnd.NextDouble() > .5,
                    DateTime.Today.AddDays(rnd.Next(365))
                );
            }
            tbl.EndLoadData();

            // return table
            return tbl;
        }
    }

    // object used to return the results (like OData)
    public class OutputValue
    {
        public string context { get; set; }
        public int count { get; set; }
        public IList<object> value { get; set; }
    }

}