using System;
using System.Collections.Generic;
using FamilyTreeAPI.Models.Enums;

namespace FamilyTreeAPI.Models
{
    public class FamilyMember
    {
        public string Id { get; set; }
        public string Firstname { get; set;}
        public string Surname { get; set; }
        public string Middlename { get; set; }
        public string Fullname { get => $"{Surname} {Firstname} {Middlename}"; }
        public GenderEnum Gender { get; set; }
        public DateTime DateOfBirth { get; set; }
        public DateTime DateOfDeath { get; set; }
        public List<FamilyMember> Childs { get; set; } = new List<FamilyMember>();
        public List<FamilyMember> Parents { get; set; } = new List<FamilyMember>();
    }
}
