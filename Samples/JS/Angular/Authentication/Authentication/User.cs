//------------------------------------------------------------------------------
// <auto-generated>
//    This code was generated from a template.
//
//    Manual changes to this file may cause unexpected behavior in your application.
//    Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Auth
{
    using System;
    using System.Collections.Generic;
    
    public partial class User
    {
        public string name { get; set; }
        public string email { get; set; }
        public string password { get; set; }
        public short role { get; set; }
        public System.DateTime created { get; set; }
        public System.DateTime lastaccess { get; set; }
        public string provider { get; set; }
        public string data { get; set; }
    }
}
