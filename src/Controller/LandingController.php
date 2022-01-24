<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class LandingController extends AbstractController
{
    /**
    * @Route("/test", name="landing")
    */
    public function show()
    {
        return $this->render (
            'landing.html.twig'
        );
    }
}