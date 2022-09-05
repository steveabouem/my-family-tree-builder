<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Expense;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use ApiPlatform\Core\Annotation\ApiResource;

/**
* @ApiResource()
*/
class ExpenseController extends AbstractController
{
    /**
    * @Route("/expenses", name="list_expenses", methods={"GET", "HEAD"})
    */
    public function show()
    {
        $expenses = $this->getDoctrine()->getRepository(Expense::class)->findAll();

        return new JsonResponse(
            [
                'data' => $expenses
            ]
        );
    }

    /**
    * @Route("api/expenses/new", name="create_expense", methods={"POST"})
    */
    public function create(Request $request)
    {
    /** @var Serializer $serializer */
        $serializer = $this->get('serializer');
        $expense = $serializer->deserialize($request->getContent(),
            Expense::class, 'json'
        );
var_dump($expense);
        $em = $this->getDoctrine()->getManager();
        $em->persist($expense);
        $em->flush();

        return new JsonResponse (
           [
            'data' => $expense
           ]
        );
    }

}

