using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SpeechTimer.Controllers
{
    public class TimerController : Controller
    {
        public ActionResult Index()
        {
            return RedirectToAction("Index", "Home");
        }

        public ActionResult Countdown()
        {
            return View();
        }

        public ActionResult Controls()
        {
            return View();
        }

        public ActionResult SinglePage()
        {
            return View();
        }
	}
}