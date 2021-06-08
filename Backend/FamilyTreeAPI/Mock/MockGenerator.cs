using FamilyTreeAPI.Extensions;
using FamilyTreeAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


namespace FamilyTreeAPI.Mock
{
    public class MockGenerator
    {
        private List<FamilyMember> _members = new List<FamilyMember>
        {
            new FamilyMember
            {
                Id = "1",
                Surname = "Иванов",
                Firstname = "Сергей",
                Middlename = "Иванович",
                Gender = Models.Enums.GenderEnum.Male,
                DateOfBirth = DateTime.Now.AddYears(-25),
            },
            new FamilyMember
            {
                Id = "2",
                Surname = "Иванов",
                Firstname = "Иван",
                Middlename = "Иванович",
                Gender = Models.Enums.GenderEnum.Male,
                DateOfBirth = DateTime.Now.AddYears(-50),
            },
            new FamilyMember
            {
                Id = "3",
                Surname = "Иванова",
                Firstname = "Мария",
                Middlename = "Владимировна",
                Gender = Models.Enums.GenderEnum.Female,
                DateOfBirth = DateTime.Now.AddYears(-50),
            },
            new FamilyMember
            {
                Id = "4",
                Surname = "Иванов",
                Firstname = "Петр",
                Middlename = "Сергеевич",
                Gender = Models.Enums.GenderEnum.Male,
                DateOfBirth = DateTime.Now.AddYears(-5),
            }
        };
        private FamilyInfo familyInfos = new FamilyInfo
        {
            Id = "1",
            Surname = "Ивановы"
        };
        private List<(string memId, string rId)> relationsToParent = new List<(string memId, string rId)>
        {
            ("1", "2"),
            ("1", "3"),
            ("4", "1")
        };
        private List<(string memId, string rId)> relationsToChilds = new List<(string memId, string rId)>
        {
            ("1", "4"),
            ("2", "1"),
            ("3", "1")
        };
        public async Task<FamilyInfo> GetFamilyData (string id, string memberId)
        {
            var members = _members;

            foreach (var member in members)
            {
                BindRelations(member);
            }
            familyInfos.Members = members;

            return familyInfos;
        }

        public async Task<FamilyMember> GetMemberData (string memberId)
        {
            var result = _members.FirstOrDefault(m => m.Id == memberId);
            BindRelations(result);
            return _members.FirstOrDefault(m => m.Id == memberId);
        }

        private FamilyMember BindRelations(FamilyMember member)
        {
            member.Childs.Clear();
            member.Parents.Clear();
            foreach (var relation in relationsToParent.Where(t => t.memId == member.Id))
            {
                foreach (var relatedMember in _members.Where(n => n.Id == relation.rId))
                {
                    member.Parents.Add(relatedMember);
                }
            }
            foreach (var relation in relationsToChilds.Where(t => t.memId == member.Id))
            {
                foreach (var relatedMember in _members.Where(n => n.Id == relation.rId))
                {
                    member.Childs.Add(relatedMember);
                }
            }
            member.RemoveCyclicValues();
            return member;
        }
    }
}
