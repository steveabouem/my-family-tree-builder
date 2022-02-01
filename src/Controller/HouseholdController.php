<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class HouseholdController extends AbstractController
{
    /**
    * @Route("/my-household", name="household_landing")
    */
    public function show()
    {
         return $this->render (
            'household/index.html.twig'
        );
    }
}