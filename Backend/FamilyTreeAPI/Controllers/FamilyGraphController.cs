using FamilyTreeAPI.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
namespace FamilyTreeAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FamilyGraphController : ControllerBase
    {
        public Mock.MockGenerator _mock;
        public FamilyGraphController(Mock.MockGenerator mockGenerator)
        {
            _mock = mockGenerator;
        }
        [HttpGet("familyInfo")]
        public async Task<FamilyInfo> GetFamilyInfo([FromQuery] string familyId, [FromQuery] string userId)
        {
            return await _mock.GetFamilyData(familyId, userId);
        }
        [HttpGet("nodeInfo")]
        public async Task<FamilyMember> GetFamilyMember([FromQuery] string memberId)
        {
            return await _mock.GetMemberData(memberId);
        }
    }
}
