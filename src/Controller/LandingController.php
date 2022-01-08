<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
* @Route("/")
*/
class LandingController
{
    /**
    * @Route("/", name="home_page", methods={"GET", "HEAD"})
    */
    public function show(): Response
    {
        return new Response ('<html><body>Temp</body></html>');
    }
}