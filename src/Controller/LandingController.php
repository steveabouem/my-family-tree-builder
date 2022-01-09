<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
* @Route("/")
*/
class LandingController extends AbstractController
{
    /**
    * @Route("/", name="home_page", methods={"GET", "HEAD"})
    */
    public function show(): Response
    {
        return new Response ('<html><body>Landing</body></html>');
    }
}