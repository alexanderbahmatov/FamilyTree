using FamilyTreeAPI.Models;

namespace FamilyTreeAPI.Extensions
{
    public static class FamilyMemberExtensions
    {
        public static void RemoveCyclicValues (this FamilyMember member)
        {
            member.Childs.ForEach(c => { c.Childs.Clear(); c.Parents.Clear(); });
            member.Parents.ForEach(c => { c.Childs.Clear(); c.Parents.Clear(); });
        }
    }
}
