using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SpeechTimer.Controllers
{
    public class TimerController : Controller
    {
        //
        // GET: /Timer/
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Controls()
        {
            return View();
        }
	}
}