using System.Collections.Generic;

namespace FamilyTreeAPI.Models
{
    public class FamilyInfo
    {
        public string Id { get; set; }
        public string Surname { get; set; }
        public List<FamilyMember> Members { get; set; }
    }
}
