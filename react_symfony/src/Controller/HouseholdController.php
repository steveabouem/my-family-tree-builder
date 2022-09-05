<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class HouseholdController extends AbstractController
{
    /**
    * @Route("/my-household", name="household_landing")
    */
    public function show(Request $request)
    {
        $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');

        $user = $this->getUser();

         return $this->render (
            'household/index.html.twig', ["user" => $user]
        );
    }

    /**
    * @Route("api/my-household/new", name="create_household")
    */
    public function createNew(Request $request)
    {
        $householdData= $request->getContent();
        dd($householdData);
    }
}