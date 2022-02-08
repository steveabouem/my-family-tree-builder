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
//         $repository = $this->getDoctrine()->getRepository(Household::class);
//         $householdData = $repository->findOneById(1);

         return $this->render (
            'household/index.html.twig'
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